var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('Carousel/index');
});

module.exports = router;