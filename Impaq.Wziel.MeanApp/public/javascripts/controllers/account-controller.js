angular.module('flapperNews').controller('AccountCtrl', [
    '$scope',
    'users',
    function ($scope, users) {
        $scope.user = users.user;
        //wait for user to be loaded
        $scope.$on('user:updated', function (event, data) {
            $scope.user = data;
        });
        //tell users-factory to fetch the user
        users.fetchUser();
        
        $scope.password = {};
        
        $scope.resetForm = function (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        
        var resetPassModel = function () {
            $scope.password.new1 = '';
            $scope.password.new2 = '';
            $scope.password.old = '';
        };
        
        var resetDataModel = function () {
            //variables for edit user
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
        }
        
        var failPass = function () {
            $scope.password.fail = true;
            $scope.password.succ = false;
        }
        
        var succPass = function () {
            $scope.password.fail = false;
            $scope.password.succ = true;
        }
        
        $scope.resetPass = function () {
            $scope.password.fail = false;
            $scope.password.succ = false;
        }
        
        var failData = function () {
            $scope.data_fail = true;
            $scope.data_succ = false;
        }
        
        var succData = function () {
            $scope.data_fail = false;
            $scope.data_succ = true;
        }
        
        $scope.resetData = function () {
            $scope.data_fail = false;
            $scope.data_succ = false;
        }
        
        resetPassModel();
        resetDataModel();
        
        $scope.submit_data = function () {
            //check if form is valid and if any changes have been made
            if (!$scope.dataForm.$valid || (!$scope.firstName && !$scope.lastName && !$scope.email) ){
                failData();
                return;
            }

            users.edit($scope.firstName, $scope.lastName, $scope.email)
            .then(function (success) {
                if (success == true) {
                    succData();
                }
                else {
                    failData();
                }
            });
        }
        
        $scope.submit_pass = function () {
            if (!$scope.passForm.$valid) {
                resetPassModel();
                failPass();
                return;
            }
            users.changePass($scope.password.old, $scope.password.new1)
            .then(function (success) {
                resetPassModel();
                if (success === true) {
                    succPass();
                }
                else {
                    failPass();
                }
            });
        }
    }]);
