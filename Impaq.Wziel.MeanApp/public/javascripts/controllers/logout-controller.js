angular.module('flapperNews').controller('LogoutCtrl', [
    '$scope',
    '$state',
    'prevState',
    'users',
    function ($scope, $state, prevState, users) {
        users.logOut().then(function () {
            if (prevState.name === 'posts-create' || prevState.name == 'account') {
                $state.go('home', { page: 1 });
            }
            else {
                $state.go(prevState.name, prevState.params);
            }
        });
    }]);