(impl-trait .tradables-trait.tradables-trait)

;; tradables where all instances are owned by the contract
;; transfers will never change ownership

(define-read-only (get-owner (tradable-id uint))
  (ok (some (as-contract tx-sender)))
)

;; transfer is successful, however, the owner will never change
(define-public (transfer (tradable-id uint) (sender principal) (recipient principal))
  (ok true)
)
