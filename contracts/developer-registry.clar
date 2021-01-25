(define-non-fungible-token developer-nft uint)

(define-map registry ((id uint)) ( (name (string-ascii 30)) (url (string-ascii 250))))

(define-data-var last-id int 0)

(define-public (say-hi) (ok "Welcome to Clarity demo"))

(define-read-only (get-last-id) (var-get last-id))

(define-public (register (name (string-ascii 30)) (url (string-ascii 250))) (let ((id (+ (get-last-id) 1))) (begin (var-set last-id id) (map-insert registry {id: id} {name: name, url: url}) ) (ok id)))

(define-read-only (get-data-by-name (name (string-ascii 30)))
   (map-get? registry {id: (unwrap-err (map-get? lookup {name: name}) u1)}))
