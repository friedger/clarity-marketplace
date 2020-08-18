(define-trait tradables-trait
  (
    (owner-of? (uint) (response principal uint))
    (transfer (uint principal) (response bool uint))
  )
)
