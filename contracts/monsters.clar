(impl-trait 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.nft-trait.nft-trait)

(define-map monsters {monster-id: uint}
  {name: (string-ascii 20),
  last-meal: uint,
  image: uint,
  date-of-birth: uint}
)

{name: "text", last-meal: "block-height", image: "number-index", date-of-birth: "block-height"}
(define-read-only (get-meta-data (monster-id uint))
    (map-get? monsters {monster-id: monster-id}))


(define-non-fungible-token nft-monsters uint)
(define-data-var next-id uint u1)
(define-constant hunger-tolerance u86400) ;; 1 day in seconds

(define-private (get-time)
   (unwrap-panic (get-block-info? time (- block-height u1))))

(define-private (is-last-meal-young (last-meal uint))
  (> (to-int last-meal) (to-int (- (get-time) hunger-tolerance))))

{action: "create"}
(define-public (create-monster (name (string-ascii 20)) (image uint))
    (let ((monster-id (var-get next-id)))
      (if (is-ok (nft-mint? nft-monsters monster-id tx-sender))
        (begin
          (var-set next-id (+ monster-id u1))
          (map-set monsters {monster-id: monster-id}
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
  (match (map-get? monsters {monster-id: monster-id})
    monster (let ((last-meal (get-time)))
      (if (is-last-meal-young (get last-meal monster))
        (begin
          (map-set monsters {monster-id: monster-id} {
            name: (get name monster),
            last-meal: last-meal,
            image: (get image monster),
            date-of-birth: (get date-of-birth monster)
            })
          (ok block-height))
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
  (match (map-get? monsters {monster-id: monster-id})
    monster (ok (is-last-meal-young (get last-meal monster)))
   err-monster-unborn
  )
)


;; error handling
(define-constant err-transfer-not-allowed (err u401)) ;; unauthorized
(define-constant err-monster-unborn (err u404)) ;; not found
(define-constant err-sender-equals-recipient (err u405)) ;; method not allowed
(define-constant err-monster-exists (err u409)) ;; conflict
(define-constant err-monster-died (err u501)) ;; internal error


(define-map err-strings (response uint uint) (string-ascii 32))
(map-insert err-strings err-transfer-not-allowed "transfer-not-allowed")
(map-insert err-strings err-monster-unborn "monster-unborn")
(map-insert err-strings err-sender-equals-recipient "sender-equals-recipient")
(map-insert err-strings err-monster-exists "monster-exists")
(map-insert err-strings err-monster-died "monster-died")

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

(define-read-only (get-errstr (code uint))
  (unwrap! (map-get? err-strings (err code)) "unknown-error"))
