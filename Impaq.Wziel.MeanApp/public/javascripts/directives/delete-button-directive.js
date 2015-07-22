angular.module('flapperNews').directive('deleteButton',
    function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/delete-button.html',
        scope: {
            action: '&'
        }
    };
});