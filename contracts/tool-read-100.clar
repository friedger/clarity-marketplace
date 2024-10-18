(define-public (activate)
    (begin
        (unwrap-panic (contract-call? .tool-loop-100 activate-with .tool-read))
        (ok true)))