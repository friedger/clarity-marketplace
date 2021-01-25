(define-constant owner 'ST3X2W2SH9XQZRHHYJ21KWGTT1N6WX3D48K1NSTPE)
(define-fungible-token connect-token)
(begin
 (ft-mint? connect-token u100000000 owner))

(define-public (transfer  (recipient principal) (amount uint))
  (ok (ft-transfer? connect-token amount tx-sender recipient)))
