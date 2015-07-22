angular.module('flapperNews').directive('navbar',
    ['users',
        function (users) {
        return {
            restrict : 'E',
            replace: true,
            templateUrl: "/templates/directives/navbar.html",
            link: function (scope, element, attrs) {
                
                scope.title = "Flapper news";
                scope.selected = 0;
                
                //wait for user to change, either by fetch, or later when user logs in/out
                scope.$on('user:updated', function (event, data) {
                    scope.user = data;
                });
                
                //tell users-factory to fetch user from server
                users.fetchUser();
                
                //wait for state to change
                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    switch (toState.name) {
                        case 'home': scope.selected = 0; break;
                        case 'account': scope.selected = 1; break;
                        case 'login': scope.selected = 3; break;
                        case 'signup': scope.selected = 4; break;
                        case 'posts-create': scope.selected = 5; break;
                        default: scope.selected = -1;
                    }
                });
                
                scope.links = [
                    { id: 0, showCondition: 'true', url: '/#/home/1' , title: 'Home' }, 
                    { id: 1, showCondition: 'user', url: '/#/account', title: 'My Account' }, 
                    { id: 2, showCondition: 'user', url: '/#/logout' , title: 'Log out' },
                    { id: 3, showCondition: '!user', url: '/#/login' , title: 'Log in' }, 
                    { id: 4, showCondition: '!user', url: '/#/signup', title: 'Sign up' }, 
                    { id: 5, showCondition: 'user.rights === "admin"', url: '/#/create', title: 'New Post' },
                ];
            }
        };
    }]);