angular.module('flapperNews').directive('pagination', function () {
    return {
        restrict: 'E',
        templateUrl: '/templates/directives/pagination.html',
        scope: {
            pageCurr: '=curr',
            pageCount: '@count',
            maxPageCount: '@max',
            urlPrefiks: '@urlprefiks'
        },
        link: function (scope, element) {
            var sufiks = Math.min(scope.maxPageCount, scope.pageCount - scope.pageCurr);
            var prefiks = 2 * scope.maxPageCount - sufiks;
            var startPage = Math.max(1, scope.pageCurr - prefiks);
            var endPage = Math.min(startPage + 2 * scope.maxPageCount, scope.pageCount);
            scope.numbers = [];
            for (var i = startPage; i <= endPage; ++i) {
                scope.numbers.push(i);
            }
        }
    };
})