(define-data-var a-string (string-utf8 100) u"Hello")

(var-set a-string (concat (var-get a-string) u" to Clarity Language"))
(print (var-get a-string))
