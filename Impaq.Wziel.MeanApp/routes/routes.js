var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

require('./routes-params.js')(router);
require('./routes-posts.js')(router);
require('./routes-login.js')(router);
require('./routes-comments.js')(router);

module.exports = router;