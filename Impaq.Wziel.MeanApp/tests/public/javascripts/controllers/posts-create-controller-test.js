'use strict'

describe('PostsCreateCtrl', function () {
    var scope, ctrl, posts, state;
    
    beforeEach(function () {
        var mockPostsService = {};
        var mockStateService = {};
        module('flapperNews', function ($provide) {
            $provide.value('posts', mockPostsService);
            $provide.value('$state', mockStateService);
        });
        
        inject(function ($q) {
            mockPostsService.create = function (data) {
                var deferred = $q.defer();
                var title = data.title;
                var body = data.body;
                 
                if (!title || title === '' || !body || body === '') {
                    deferred.resolve({ err: 'title or body is empty' });
                }
                else {
                    deferred.resolve({ post: { _id: 99 }});
                }
                return deferred.promise;
            };
        });
       
        mockStateService.go = function (stateName, transitionData) {
            mockStateService.callData = {
                name: stateName,
                id: transitionData.id,
                page: transitionData.page
            }
        }
        
        inject(function ($rootScope, $controller, _posts_, _$state_) {
            scope = $rootScope.$new();
            posts = _posts_;
            state = _$state_;
            ctrl = $controller('PostsCreateCtrl', { $scope: scope, posts: posts, $state: state });
        });
    });
    
    describe('on start', function () {
        it("should have title as empty string", function () {
            expect(scope.title).toBe('');
        })
        
        it('should have body as empty string', function () {
            expect(scope.body).toBe('');
        })
    })
    
    describe('on adding post', function () {
        it('should redirect to page of added post when title and body is not empty', function () {
            scope.title = scope.body = "notempty";
            scope.addPost();
            //always call scope.$apply to cause a digest cycle and the promise can be called
            scope.$apply();
            expect(state.callData.name).toBe('posts');
            expect(state.callData.id).toBe(99);
            expect(state.callData.page).toBe(1);
        });
        
        it('should not redirect to any other page when title is empty', function () {
            scope.title = '';
            scope.body = 'notempty';
            scope.$apply();
            expect(state.callData).toBe(undefined);
        });
        
        it('should not redirect to any other page when body is empty', function () {
            scope.body = '';
            scope.title = 'notempty';
            scope.$apply();
            expect(state.callData).toBe(undefined);
        });
    })
})