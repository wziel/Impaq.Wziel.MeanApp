var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

module.exports = function (router) {
    
    router.param('post', function (req, res, next, id) {
        var query = Post.findById(id);
        
        query.exec(function (err, post) {
            if (err) { return next(err); }
            if (!post) { return next(new Error('can\'t find post')); }

            req.post = post;
            return next();
        });
    });

    router.param('comment', function (req, res, next, id) {
        var query = Comment.findById(id);
        
        query.exec(function (err, comment) {
            if (err) { return next(err); }
            if (!comment) { return next(new Error('can\'t find comment')); }
            
            req.comment = comment;
            return next();
        });
    });
}
