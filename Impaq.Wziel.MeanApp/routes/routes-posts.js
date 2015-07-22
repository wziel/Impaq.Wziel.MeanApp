var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

module.exports = function (router) {
    
    router.get('/posts', function (req, res, next) {
        Post.find(function (err, posts) {
            if (err) { return next(err); }
            res.json(posts);
        });
    });
    
    router.post('/posts', function (req, res, next) {
        if (req.user && req.user.isAdmin()) {
            var post = new Post(req.body);
            
            post.save(function (err, post) {
                if (err) { return next(err); }
                
                res.json({ post: post });
            });
        }
        else {
            res.json({ err: true });
        }
    });
    
    router.get('/posts/:count/:page', function (req, res, next) {
        page = parseInt(req.params.page);
        pageSize = parseInt(req.params.count);
        
        Post.find({}, {'comments' : 0}).sort({ 'created' : -1 }).skip((page - 1) * pageSize).limit(pageSize).exec(function (err, foundPosts) {
            if (err) { return next(err); }
            Post.count({}, function (err, count) {
                if (err) { return next(err); }
                
                //if user is logged in, we check if he has 'liked' any of the posts and we mark them as upvoted
                if (req.user) {
                    req.user.attachUpvotedFieldTo(foundPosts);
                }
                
                //get rid of upvoters list for posts
                for (var i = 0; i < foundPosts.length; ++i) {
                    foundPosts[i].upvoters = undefined;
                }

                res.json({
                    posts : foundPosts,
                    //the count of all pages needed to display all items - used in pagination
                    pageCount : Math.round(count / pageSize),
                    pageCurr : page
                });
            });
        });
    });
    
    router.get('/posts/:post/:count/:page', function (req, res) {
        var count = parseInt(req.params.count);
        var page = parseInt(req.params.page);
        
        req.post.populate({
            path: 'comments',
            options: {
                sort: { 'created' : -1 },
                skip: (page - 1) * count,
                limit: count
            }
        }, 
            function (err, post) {
            if (err) { return next(err); }
            var result = req.post._doc.comments;
            
            if (req.user) {
                req.post._doc.upvoted = post.isUpvotedBy(req.user);
                req.user.attachUpvotedFieldTo(result);
            }
            //get rid of the list of upvoters
            req.post._doc.upvoters = undefined;
            for (var i = 0; i < result.length; ++i) {
                result[i].upvoters = undefined;
            }
            res.json(req.post);
        });
    });
    
    router.get('/posts/count', function (req, res) {
        Post.count({}, function (err, count) {
            if (err) { return next(err); }
            res.json(count);
        });
    });
    
    router.put('/posts/:post/upvote', function (req, res, next) {
        if (req.user) {
            if (!req.post.isUpvotedBy(req.user)) {
                req.post.upvote(req.user, function (err, post) {
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
    
    router.put('/posts/:post/downvote', function (req, res, next) {
        if (req.user) {
            if (req.post.isUpvotedBy(req.user)) {
                req.post.downvote(req.user, function (err, post) {
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
    
    router.delete('/posts/:post', function (req, res, next) {
        if (req.user && req.user.isAdmin()) {
            req.post.populate(
                { path: 'comments' },
                function (err, post) {
                    if (err) { return next(err); }
                    for (var i = 0; i < req.post.comments.length; ++i) {
                        req.post.comments.remove();
                    }
                    req.post.remove();
                    res.json(true);
                });
        }
    });
    
    router.delete('/comments/:comment', function (req, res, next) {
        if (req.user && req.user.isAdmin()) {
            req.comment.remove();
            res.json(true);
        }
    });
}