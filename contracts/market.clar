(define-trait tradable-trait
  (
    (owner-of? (uint) (response principal uint))
    (transfer (uint principal) (response principal uint))
  )
)

(define-map offers ((bid-owner principal) (owner principal) (tradable principal) (tradable-id uint))
  ((price uint))
)

(define-constant err-invalid-offer-key u1)
(define-constant err-payment-failed u2)
(define-constant err-transfer-failed u3)

(define-private (get-owner (tradable <tradable-trait>) (tradable-id uint))
  (contract-call? tradable owner-of? tradable-id)
)

(define-private (transfer-tradable-to-escrow (tradable <tradable-trait>) (tradable-id uint))
  (contract-call? tradable transfer tradable-id (as-contract tx-sender))
)

;; called by the bidder ;-)
(define-public (bid (tradable <tradable-trait>) (tradable-id uint) (price uint))
  (let ((tradable-owner (unwrap-panic (get-owner tradable tradable-id))))
    (ok (map-insert offers {bid-owner: tx-sender, owner: tradable-owner, tradable: (contract-of tradable), tradable-id: tradable-id}
                {price: price}))
  )
)

;; called by the monster owner
(define-public (accept (tradable <tradable-trait>) (tradable-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, tradable: (contract-of tradable), tradable-id: tradable-id})
    offer (transfer-tradable-to-escrow tradable tradable-id)
    (err err-invalid-offer-key)
  )
)

;; called by the bidder
(define-public (pay (tradable <tradable-trait>) (tradable-id uint))
  (let (
      (owner (unwrap-panic (get-owner tradable tradable-id)))
      (bid-owner tx-sender)
    )
    (let ((offer (unwrap-panic
          (map-get? offers {bid-owner: tx-sender, owner: owner, tradable: (contract-of tradable), tradable-id: tradable-id}))))

      (match (stx-transfer?  (get price offer) tx-sender owner)
          success (match (as-contract (contract-call? tradable transfer tradable-id bid-owner))
              transferred (begin
                (map-delete offers {bid-owner: tx-sender, owner: owner, tradable: (contract-of tradable), tradable-id: tradable-id})
                (ok true)
               )
              error (err err-transfer-failed)
          )
        error (err err-payment-failed)
      )
    )
  )
)
