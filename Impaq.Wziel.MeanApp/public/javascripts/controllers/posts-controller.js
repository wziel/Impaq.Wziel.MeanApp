
angular.module('flapperNews').controller('PostsCtrl', [
    '$scope',
    '$location',
    'posts',
    'post',
    'page',
    'users',
    function ($scope, $location, posts, post, page, users) {
        $scope.pagesCount = Math.ceil(posts.commentsAllCount / posts.commentsPerPage);
        $scope.maxPages = posts.maxPages;
        $scope.pageCurr = page.current;
        
        $scope.post = post;
        $scope.body = '';
        $scope.addComment = function () {
            if ($scope.body === '' || !users.user) { return; }
            posts.addComment(post._id, {
                body: $scope.body,
                author: users.user.username,
            }).then(function (comment) {
                $scope.post.comments.unshift(comment);
            });
            $scope.body = '';
        };
        
        $scope.delete = function (comment) {
            if (confirm('Are you sure you want to delete comment created by ' + comment.author + '?')) {
                posts.deleteComment(comment).then(function (data) {
                    if (data.data === true) {
                        for (var i = 0; i < $scope.post.comments.length; ++i) {
                            if ($scope.post.comments[i]._id == comment._id) {
                                $scope.post.comments.splice(i, 1);
                                return data;
                            }
                        }
                    }
                });
            }
        }
        
        $scope.incrementUpvotes = function (comment) {
            posts.upvoteComment(post, comment);
        };
        
        $scope.decrementUpvotes = function (comment) {
            posts.downvoteComment(post, comment);
        }
        
        $scope.user = users.user;
        
        $scope.getDateFrom = function (comment) {
            var date = new Date(comment.created);
            var localeString = date.toLocaleString();
            var noSeconds = localeString.slice(0, -3);
            return noSeconds;
        }
        
        $scope.incrementUpvotesForPost = function () {
            posts.upvote(post);
        }
        
        $scope.decrementUpvotesForPost = function () {
            posts.downvote(post);
        }
        
        $scope.deletePost = function () {
            if (confirm('Are you sure you want to delete "' + post.title + '" post?')) {
                posts.delete(post);
                $location.path('/home/1');
            }
        }
        
        //wait for user to change, either by fetch, or later when user logs in/out
        $scope.$on('user:updated', function (event, data) {
            $scope.user = data;
        });
    }]);