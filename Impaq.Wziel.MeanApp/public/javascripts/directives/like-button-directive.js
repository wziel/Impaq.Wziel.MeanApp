angular.module('flapperNews').directive('likeButton',
    function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/like-button.html',
        scope: {
            interactive: '=',
            count: '=',
            liked: '=',
            like: '&',
            unlike: '&'
        },
        controller: function () {

        }
    };
});