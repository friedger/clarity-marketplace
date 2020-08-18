(impl-trait .market.tradable-trait)

;; a tradable where all instances are owned by the contract
;; transfers will never change ownership

(define-read-only (owner-of? (tradable-id uint))
  (ok (as-contract tx-sender))
)

;; transfer is successful, however, the owner will never change
(define-public (transfer (tradable-id uint) (recipient principal))
  (ok true)
)
