var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

module.exports = function (router) {
    
    router.get('/comments/:postId/count', function (req, res) {
        Comment.count({ post : req.params.postId }, function (err, count) {
            if (err) { return next(err); }
            res.json(count);
        });
    });
    
    router.post('/posts/:post/comments', function (req, res, next) {
        var comment = new Comment(req.body);
        comment.post = req.post;
        comment.save(function (err, comment) {
            if (err) { return next(err); }
            req.post.comments.push(comment);
            req.post.save(function (err, post) {
                if (err) { return next(err); }
                
                res.json(comment);
            });
        });
    });
    
    router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
        if (req.user) {
            if (!req.comment.isUpvotedBy(req.user)) {
                req.comment.upvote(req.user, function (err, post) {
                    if (err) { return next(err); }
                    res.json(true);
                });
            }
            else {
                res.json(false);
            }
        }
        else {
            res.json(false);
        }
    });
    
    router.put('/posts/:post/comments/:comment/downvote', function (req, res, next) {
        if (req.user) {
                if (req.comment.isUpvotedBy(req.user)) {
                    req.comment.downvote(req.user, function (err, post) {
                        if (err) { return next(err); }
                        res.json(true);
                    });
                }
                else {
                    res.json(false);
                }
        }
        else {
            res.json(false);
        }
    });
}