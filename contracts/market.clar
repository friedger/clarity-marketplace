(use-trait tradables-trait .tradables-trait.tradables-trait)

(define-map on-sale
  {owner: principal, tradables: principal, tradable-id: uint}
  {price: uint, duration: uint}
)

(define-map offers {bid-owner: principal, owner: principal, tradables: principal, tradable-id: uint}
  {price: uint}
)

(define-map accepting-owners {tradables: principal, tradable-id: uint}
  {owner: principal}
)
(define-constant err-invalid-offer-key u1)
(define-constant err-payment-failed u2)
(define-constant err-transfer-failed u3)
(define-constant err-not-allowed u4)
(define-constant err-duplicate-entry u5)
(define-constant err-tradable-not-found u6)

(define-private (get-owner (tradables <tradables-trait>) (tradable-id uint))
  (contract-call? tradables get-owner tradable-id)
)

(define-private (transfer-tradable-to-escrow (tradables <tradables-trait>) (tradable-id uint))
  (begin
    (map-insert accepting-owners {tradables: (contract-of tradables), tradable-id: tradable-id} {owner: tx-sender})
    (contract-call? tradables transfer tradable-id tx-sender (as-contract tx-sender))
  )
)

(define-private (transfer-tradable-from-escrow (tradables <tradables-trait>) (tradable-id uint))
  (let ((owner tx-sender))
    (begin
      (map-delete accepting-owners {tradables: (contract-of tradables), tradable-id: tradable-id})
      (as-contract (contract-call? tradables transfer tradable-id (as-contract tx-sender) owner))
    )
  )
)

;; called by the owner
(define-public (offer-tradable (tradables <tradables-trait>) (tradable-id uint) (price uint) (duration uint))
  (let ((tradable-owner (unwrap! (unwrap-panic (get-owner tradables tradable-id)) (err err-tradable-not-found))))
    (if (is-eq tradable-owner tx-sender)
      (if (map-insert on-sale {owner: tradable-owner, tradables: (contract-of tradables), tradable-id: tradable-id}
                {price: price, duration: duration})
          (begin
            (print {type: "offer-tradable", value: {tradables: (contract-of tradables), tradable-id: tradable-id, price: price, duration: duration}})
            (ok true))
          (err err-duplicate-entry)
      )
      (err err-not-allowed)
    )
  )
)

;; called by the bidder ;-)
(define-public (bid (tradables <tradables-trait>) (tradable-id uint) (price uint))
  (let ((tradable-owner (unwrap! (unwrap-panic (get-owner tradables tradable-id)) (err err-tradable-not-found))))
    (ok (map-insert offers {bid-owner: tx-sender, owner: tradable-owner, tradables: (contract-of tradables), tradable-id: tradable-id}
                {price: price}))
  )
)

;; called by the tradable owner after a bid was placed
(define-public (accept (tradables <tradables-trait>) (tradable-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, tradables: (contract-of tradables), tradable-id: tradable-id})
    offer (begin
      (map-delete on-sale {owner: tx-sender, tradables: (contract-of tradables), tradable-id: tradable-id})
      (match (transfer-tradable-to-escrow tradables tradable-id)
        success (begin
                  (print {type: "accept", value: {tradables: (contract-of tradables), tradable-id: tradable-id, bid-owner: bid-owner}})
                  (ok true))
        error (begin (print error) (err err-transfer-failed)))
    )
    (err err-invalid-offer-key)
  )
)

;; called by the tradable owner after a bid was accepted but not yet paid by the bidder
(define-public (cancel (tradables <tradables-trait>) (tradable-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, tradables: (contract-of tradables), tradable-id: tradable-id})
    offer (match (transfer-tradable-from-escrow tradables tradable-id)
      success (begin
                (print {type: "accept", value: {tradables: (contract-of tradables), tradable-id: tradable-id, bid-owner: bid-owner}})
                (ok true))
      error (begin (print error) (err err-transfer-failed)))
    (err err-invalid-offer-key)
  )
)

;; called by the bidder
(define-public (pay (tradables <tradables-trait>) (tradable-id uint))
  (let ((contract (contract-of tradables)))
    (let (
        (owner (unwrap-panic (get owner (map-get? accepting-owners {tradables: contract,  tradable-id: tradable-id}))))
        (bid-owner tx-sender)
      )
      (let ((offer (unwrap-panic
            (map-get? offers {bid-owner: tx-sender, owner: owner, tradables: contract, tradable-id: tradable-id}))))

        (match (stx-transfer?  (get price offer) tx-sender owner)
            success (match (as-contract (contract-call? tradables transfer tradable-id tx-sender bid-owner))
                transferred (begin
                  (map-delete accepting-owners {tradables: (contract-of tradables), tradable-id: tradable-id})
                  (map-delete offers {bid-owner: tx-sender, owner: owner, tradables: (contract-of tradables), tradable-id: tradable-id})
                  (ok true)
                )
                error (err err-transfer-failed)
            )
          error (err err-payment-failed)
        )
      )
    )
  )
)
