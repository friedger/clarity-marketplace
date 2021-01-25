(define-trait tradables-trait
  (
    (get-owner? (uint) (response principal uint))
    (transfer? (uint principal principal) (response bool uint))
  )
)
