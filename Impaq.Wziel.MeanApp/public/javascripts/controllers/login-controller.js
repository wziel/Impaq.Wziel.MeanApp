angular.module('flapperNews').controller('LoginCtrl', [
    '$scope',
    '$location',
    'users',
    function ($scope, $location, users) {
        $scope.username = '';
        $scope.password = '';
        
        $scope.failed = false;
        $scope.processing = false;
        
        $scope.hideLoginFailed = function () {
            $scope.failed = false;
        }

        $scope.login = function () {
            $scope.processing = true;
            users.authenticate($scope.username, $scope.password).then(function (success) {
                if (success === true) {
                    $location.path('/home/1');
                    return;
                }
                $scope.failed = true;
                $scope.processing = false;
                $scope.username = '';
                $scope.password = '';
            });
        };
    }]);