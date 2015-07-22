
angular.module('flapperNews').config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/home/{page}',
            templateUrl: '/templates/pages/home.html',
            controller: 'HomeCtrl',
            resolve: {
                postPromise: ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.getPage($stateParams.page);
                    }],
                postCountPromise: ['posts', function (posts) {
                        return posts.getAllCount();
                    }],
                page: ['$stateParams', function ($stateParams) {
                        return {
                            current: parseInt($stateParams.page)
                        };
                    }]
            }
        })
        .state('posts', {
            url: '/posts/{id}/{page}',
            templateUrl: '/templates/pages/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                commentsCountPromise: ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.getCommentsAllCount($stateParams.id);
                    }],
                post: ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.get($stateParams.id, $stateParams.page);
                    }],
                page: ['$stateParams', function ($stateParams) {
                        return {
                            current: parseInt($stateParams.page)
                        };
                    }]
            }
        })
        .state('logout', {
            url: '/logout',
            template: '',
            controller: 'LogoutCtrl',
            resolve: {
                prevState: ['$state', function ($state) {
                        return {
                            name: $state.current.name,
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                    }]
            }
        })
        .state('posts-create', {
            url: '/create',
            templateUrl: '/templates/pages/posts-create.html',
            controller: 'PostsCreateCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/pages/login.html',
            controller: 'LoginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/pages/signup.html',
            controller: 'SignupCtrl'
        })
        .state('account', {
            url: '/account',
            templateUrl: 'templates/pages/account.html',
            controller: 'AccountCtrl'
        });
        $urlRouterProvider.when('/posts/{id}', '/posts/{id}/1');
        $urlRouterProvider.otherwise('home/1');
    }]);