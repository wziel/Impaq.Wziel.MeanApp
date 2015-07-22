angular.module('flapperNews').controller('PostsCreateCtrl', [
    '$scope',
    '$state',
    'posts',
    function ($scope, $state, posts) {
        
        $scope.title = '';
        $scope.body = '';
        $scope.failed = false;
        
        $scope.addPost = function () {
            if (!$scope.title || $scope.title === '' || !$scope.body || $scope.body === '') {
                $scope.failed = true;
                return;
            }
            posts.create({
                title: $scope.title,
                body: $scope.body
            }).then(function (data) {
                if (data.err) {
                    $scope.failed = true;
                }
                else {
                    $state.go('posts', {
                        id: data.post._id, 
                        page: 1
                    });
                }
            });
        };
        
        $scope.resetFailed = function () {
            $scope.failed = false;
        }
    }]);
