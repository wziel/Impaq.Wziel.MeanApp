angular.module('flapperNews').directive('compare', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            otherModelValue: '=compare'
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue === scope.otherModelValue;
            }

            scope.$watch('otherModelValue', function () {
                ngModel.$validate();
            });
        }
    }
})