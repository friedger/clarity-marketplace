(define-map offers ((bid-owner principal) (owner principal) (monster-id uint))
  ((price uint))
)

(define-map accepting-owners ((monster-id uint))
  ((owner principal))
)

(define-constant err-invalid-offer-key u1)
(define-constant err-payment-failed u2)
(define-constant err-transfer-failed u3)

(define-private (get-owner (monster-id uint))
  (contract-call? .monsters owner-of? monster-id)
)

(define-private (transfer-monster-to-escrow  (monster-id uint))
  (begin
    (map-insert accepting-owners {monster-id: monster-id} {owner: tx-sender})
    (contract-call? .monsters transfer monster-id (as-contract tx-sender))
  )
)

(define-private (transfer-monster-from-escrow  (monster-id uint))
  (let ((owner tx-sender))
    (begin
      (map-delete accepting-owners {monster-id: monster-id})
      (as-contract (contract-call? .monsters transfer monster-id owner))
    )
  )
)

;; called by the bidder ;-)
(define-public (bid (monster-id uint) (price uint))
  (let ((monster-owner  (unwrap-panic (get-owner monster-id))))
    (ok (map-insert offers {bid-owner: tx-sender, owner: monster-owner, monster-id: monster-id}
                {price: price}))
  )
)

;; called by the tradable owner after a bid was placed
(define-public (accept  (monster-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, monster-id: monster-id})
    offer (transfer-monster-to-escrow monster-id)
    (err err-invalid-offer-key)
  )
)

;; called by the tradable owner after a bid was accepted but not yet paid by the bidder
(define-public (cancle  (monster-id uint) (bid-owner principal))
  (match (map-get? offers {owner: tx-sender, bid-owner: bid-owner, monster-id: monster-id})
    offer (transfer-monster-from-escrow monster-id)
    (err err-invalid-offer-key)
  )
)

;; called by the bidder
(define-public (pay  (monster-id uint))
  (let (
      (owner (unwrap-panic (get owner (map-get? accepting-owners {monster-id: monster-id}))))
      (bid-owner tx-sender)
    )
    (let ((offer (unwrap-panic
          (map-get? offers {bid-owner: tx-sender, owner: owner, monster-id: monster-id}))))

      (match (stx-transfer?  (get price offer) tx-sender owner)
          success (match (as-contract (contract-call? .monsters transfer monster-id bid-owner))
              transferred (begin
                (map-delete accepting-owners {monster-id: monster-id})
                (map-delete offers {bid-owner: tx-sender, owner: owner, monster-id: monster-id})
                (ok true)
               )
              error (err err-transfer-failed)
          )
        error (err err-payment-failed)
      )
    )
  )
)
