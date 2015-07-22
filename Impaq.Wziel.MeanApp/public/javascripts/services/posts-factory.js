angular.module('flapperNews').factory('posts', ['$http', function ($http) {
        var ob = {};
        ob.posts = [];
        ob.allCount = 0;
        ob.maxPages = 4;
        ob.postsPerPage = 10;
        ob.commentsPerPage = 5;
        ob.commentsAllCount = 0;
        ob.getAllCount = function () {
            return $http.get('/posts/count').success(function (data) {
                ob.allCount = data;
            });
        };
        ob.getPage = function (pageNum) {
            return $http.get('/posts/' + ob.postsPerPage + '/' + pageNum).success(function (data) {
                angular.copy(data.posts, ob.posts);
            });
        };
        ob.create = function (post) {
            return $http.post('/posts', post).then(function (data) {
                return data.data;
            });
        };
        ob.delete = function (post) {
            return $http.delete('/posts/' + post._id).then(function (data) {
                for (var i = 0; i < ob.posts.length; ++i) {
                    if (ob.posts[i]._id == post._id) {
                        ob.posts.splice(i, 1);
                        return data;
                    }
                }
            })
        }
        ob.deleteComment = function (comment) {
            return $http.delete('/comments/' + comment._id);
        }
        ob.upvote = function (post) {
            return $http.put('/posts/' + post._id + '/upvote').success(function (success) {
                if (success) {
                    post.upvotes++;
                    post.upvoted = true;
                }
            });
        };
        ob.downvote = function (post) {
            return $http.put('/posts/' + post._id + '/downvote').success(function (success) {
                if (success) {
                    post.upvotes--;
                    post.upvoted = false;
                }
            });
        }
        ob.get = function (id, page) {
            return $http.get('/posts/' + id + '/' + ob.commentsPerPage + '/' + page).then(function (res) {
                return res.data;
            });
        };
        ob.getCommentsAllCount = function (id) {
            return $http.get('/comments/' + id + '/count').success(function (data) {
                ob.commentsAllCount = data;
            });
        };
        ob.addComment = function (id, comment) {
            return $http.post('/posts/' + id + '/comments', comment).then(function (comment) {
                return comment.data;
            });
        };
        ob.upvoteComment = function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
        .success(function (success) {
                if (success) {
                    comment.upvotes++;
                    comment.upvoted = true;
                }
            });
        };
        ob.downvoteComment = function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
        .success(function (success) {
                if (success) {
                    comment.upvotes--;
                    comment.upvoted = false;
                }
            });
        };
        return ob;
    }]);
