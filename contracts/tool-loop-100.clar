(use-trait tool-trait .monsters.tool-trait)

(define-public (action (tool <tool-trait>))
    (contract-call? tool activate))

(define-public (activate-with (tool <tool-trait>))
    (begin
        (map action (list tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool
        tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool
        tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool tool
       ))
        (ok tool)))