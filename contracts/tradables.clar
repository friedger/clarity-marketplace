(define-trait tradables-definition
  (
    (get-owner (uint) (response principal uint))
    (transfer (uint principal principal) (response bool (tuple (kind (string-ascii 32)) (code uint))))
  )
)
