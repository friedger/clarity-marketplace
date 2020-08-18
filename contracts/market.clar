(use-trait tradables-trait .tradables.tradables-trait)

(define-map offers ((bid-owner principal) (owner principal) (tradables principal) (tradable-id uint))
  ((price uint))
)

(define-constant err-invalid-offer-key u1)
(define-constant err-payment-failed u2)
(define-constant err-transfer-failed u3)

(define-private (get-owner (tradables <tradables-trait>) (tradable-id uint))
  (contract-call? tradables owner-of? tradable-id)
)

(define-private (transfer-tradable-to-escrow (tradables <tradables-trait>) (tradable-id uint))
  (contract-call? tradables transfer tradable-id (as-contract tx-sender))
)

;; called by the bidder ;-)
(define-public (bid (tradables <tradables-trait>) (tradable-id uint) (price uint))
  (let ((tradable-owner (unwrap-panic (get-owner tradables tradable-id))))
    (ok (map-insert offers {bid-owner: tx-sender, owner: tradable-owner, tradables: (contract-of tradables), tradable-id: tradable-id}
                {price: price}))
  )
)

;; called by the tradable owner
(define-public (accept (tradables <tradables-trait>) (tradable-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, tradables: (contract-of tradables), tradable-id: tradable-id})
    offer (transfer-tradable-to-escrow tradables tradable-id)
    (err err-invalid-offer-key)
  )
)

;; called by the bidder
(define-public (pay (tradables <tradables-trait>) (tradable-id uint))
  (let (
      (owner (unwrap-panic (get-owner tradables tradable-id)))
      (bid-owner tx-sender)
    )
    (let ((offer (unwrap-panic
          (map-get? offers {bid-owner: tx-sender, owner: owner, tradables: (contract-of tradables), tradable-id: tradable-id}))))

      (match (stx-transfer?  (get price offer) tx-sender owner)
          success (match (as-contract (contract-call? tradables transfer tradable-id bid-owner))
              transferred (begin
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
