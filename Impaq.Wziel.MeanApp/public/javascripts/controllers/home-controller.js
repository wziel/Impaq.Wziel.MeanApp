angular.module('flapperNews').controller('HomeCtrl', [
    '$scope',
    'posts',
    'page',
    'users',
    function ($scope, posts, page, users) {
        
        $scope.posts = posts.posts;
        $scope.pagesCount = Math.ceil(posts.allCount / posts.postsPerPage);
        $scope.maxPages = posts.maxPages;
        $scope.pageCurr = page.current;

        $scope.incrementUpvotes = function (post) {
            posts.upvote(post);
        }
        
        $scope.decrementUpvotes = function (post) {
            posts.downvote(post);
        }
        
        $scope.user = users.user;

        $scope.delete = function (post) {
            if (confirm('Are you sure you want to delete "' + post.title + '" post?')) {
                posts.delete(post);
            }
        }
        
        $scope.getDateFrom = function (post) {
            var date = new Date(post.created);
            var localeString = date.toLocaleString();
            var noSeconds = localeString.slice(0, -3);
            return noSeconds;
        }
        
        //wait for user to change, either by fetch, or later when user logs in/out
        $scope.$on('user:updated', function (event, data) {
            $scope.user = data;
        });
    }]);
