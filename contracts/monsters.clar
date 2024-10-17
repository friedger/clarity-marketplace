(define-map monsters uint
  {name: (string-ascii 20),
  last-meal: uint,
  image: uint,
  date-of-birth: uint}
)

{name: "text", last-meal: "stacks-block-height", image: "number-index", date-of-birth: "stacks-block-height"}
(define-read-only (get-meta-data (monster-id uint))
    (map-get? monsters monster-id))


(define-non-fungible-token nft-monsters uint)
(define-data-var next-id uint u1)
(define-constant hunger-tolerance u86400) ;; 1 day in seconds

(define-private (get-time)
   (print (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1)))))

(define-private (is-last-meal-young (last-meal uint))
  (> (to-int last-meal) (to-int (- (get-time) hunger-tolerance))))

{action: "create"}
(define-public (create-monster (name (string-ascii 20)) (image uint))
    (let ((monster-id (var-get next-id)))
      (if (is-ok (nft-mint? nft-monsters monster-id tx-sender))
        (begin
          (var-set next-id (+ monster-id u1))
          (map-set monsters monster-id
          {
            name: name,
            last-meal: (get-time),
            image: image,
            date-of-birth: (get-time)
          })
          (ok monster-id))
        err-monster-exists)))

{control: "button"}
(define-public (feed-monster (monster-id uint))
  (match (map-get? monsters monster-id)
    monster (let ((last-meal (get-time)))
      (if (is-last-meal-young (get last-meal monster))
        (begin
          (map-set monsters monster-id (merge monster {last-meal: last-meal}))
          (ok stacks-block-height))
        err-monster-died))
    err-monster-unborn))

{action: "transfer"}
(define-public (transfer (monster-id uint) (sender principal) (recipient principal))
  (let ((owner (unwrap! (unwrap-panic (get-owner monster-id)) err-monster-unborn)))
    (if (is-eq owner sender)
      (match (nft-transfer? nft-monsters monster-id sender recipient)
        success (ok success)
        error (err-nft-transfer error))
      err-transfer-not-allowed)))

(define-read-only (get-last-token-id)
  (ok (- (var-get next-id) u1))
)

(define-read-only (get-token-uri (monster-id uint))
  (ok none))

(define-read-only (get-owner (monster-id uint))
  (match (nft-get-owner? nft-monsters monster-id)
    owner (ok (some owner))
    (ok none)
  )
)

(define-read-only (is-alive (monster-id uint))
  (match (map-get? monsters monster-id)
    monster (ok (asserts! (is-last-meal-young (get last-meal monster)) err-monster-died))
   err-monster-unborn
  )
)

;; competition
(define-trait tool-trait ((activate () (response bool uint))))
(define-map winners uint {monster-id: uint, count: uint})
(define-map second-bests uint {monster-id: uint, count: uint})
(define-map monster-actions {tenure: uint, monster-id: uint} (list 200 {tool: principal, block: uint}))
(define-constant no-monster {count: u0, monster-id: u0})

(define-public (use (monster-id uint) (tool (optional <tool-trait>)))
  (let ((action-key {tenure: tenure-height, monster-id: monster-id})
        (actions (default-to (list) 
            (map-get? monster-actions action-key)))
        (count (+ u1 (len actions)))
        (current-winner (default-to no-monster (map-get? winners tenure-height))))
    ;; only owner can use a tool for a living monster
    (asserts! (is-eq (nft-get-owner? nft-monsters monster-id) (some tx-sender)) err-not-owner)
    (try! (is-alive monster-id))
    ;; register action
    (map-set monster-actions action-key (unwrap! (as-max-len? (append actions 
              {tool: (match tool some-tool (contract-of some-tool) (as-contract tx-sender)), 
                block: stacks-block-height}) 
              u200) err-too-many-tools))
    ;; update winner
    (if (> count (get count current-winner))
      (let ((new-winner {count: count, monster-id: monster-id}))
        (print {a: "set-winner", winner: new-winner, tenure: tenure-height})
        (map-set winners tenure-height new-winner)
        (and (not (is-eq (get monster-id current-winner) monster-id))
          (begin
            (print {a: "set-prize", winner: current-winner, tenure: tenure-height})
            (map-set second-bests tenure-height current-winner))))
      (let ((second-best (default-to no-monster (map-get? second-bests tenure-height))))
        (if (> count (get count second-best))
          (let ((new-second-best {count: count, monster-id: monster-id}))
            (print {a: "set-prize", winner: new-second-best, tenure: tenure-height})
            (map-set second-bests tenure-height new-second-best))
          true)))
    (print {a: "use", tool: tool, count: count, monster-id: monster-id, tenure: tenure-height})
    ;; activate tool
    (match tool some-tool (contract-call? some-tool activate) (ok true))
  )
)

(define-read-only (get-winner (tenure uint))
  (map-get? winners tenure))

(define-public (distribute-prize (tenure uint))
  (let ((second-best (unwrap! (map-get? second-bests tenure) err-no-prize))
      (prize-id (get monster-id second-best))
      (winner-owner (unwrap! (nft-get-owner? nft-monsters 
        (unwrap! (get monster-id (get-winner tenure)) err-monster-unborn)) err-monster-unborn))
      (prize-owner (unwrap! (nft-get-owner? nft-monsters prize-id) err-monster-unborn)))
    ;; prize can only be distributed in the next tenure
    (asserts! (< tenure tenure-height) err-too-early)
    (if (> prize-id u0)
      (nft-transfer? nft-monsters prize-id prize-owner winner-owner)
      (ok true))))
      

(define-public (distribute-prizes (tenures (list 200 uint)))
  (ok (map distribute-prize tenures)))

;; error handling
(define-constant err-transfer-not-allowed (err u401)) ;; unauthorized
(define-constant err-monster-unborn (err u404)) ;; not found
(define-constant err-sender-equals-recipient (err u405)) ;; method not allowed
(define-constant err-monster-exists (err u409)) ;; conflict
(define-constant err-monster-died (err u501)) ;; internal error
(define-constant err-too-many-tools (err u502))
(define-constant err-not-owner (err u503))
(define-constant err-no-prize (err u504))
(define-constant err-too-early (err u505))

(define-private (err-nft-transfer (code uint))
  (if (is-eq u1 code)
    err-transfer-not-allowed
    (if (is-eq u2 code)
      err-sender-equals-recipient
      (if (is-eq u3 code)
        err-monster-unborn
        (err code)))))

(define-private (err-nft-mint (code uint))
  (if (is-eq u1 code)
    err-monster-exists
    (err code)))