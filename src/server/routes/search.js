var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('Search/index');
});

module.exports = router;