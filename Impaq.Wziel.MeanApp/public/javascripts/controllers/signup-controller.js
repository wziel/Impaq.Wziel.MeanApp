angular.module('flapperNews').controller('SignupCtrl', [
    '$scope',
    '$location',
    'users',
    function ($scope, $location, users) {
        var ctrl = this;
        ctrl.resetModel = function () {
            $scope.username = '';
            $scope.password = '';
            $scope.email = '';
            $scope.firstName = '';
            $scope.lastName = '';
        };
        ctrl.resetModel();
        
        $scope.failed = false;
        $scope.processing = false;
        
        $scope.signup = function () {
            $scope.processing = true;
            users.signup(
                $scope.username, 
                $scope.password,
                $scope.firstName,
                $scope.lastName,
                $scope.email)
            .then(function (success) {
                if (success === true) {
                    $location.path('/home/1');
                    return;
                }
                $scope.failed = true;
                $scope.processing = false;
                ctrl.resetModel();
            });
        };
    }]);