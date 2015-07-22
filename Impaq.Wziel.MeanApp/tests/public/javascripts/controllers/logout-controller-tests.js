'use strict'

describe('LogoutCtrl', function () {
    var ctrl, scope, state, prevState, users;
    
    var currentState = {};

    beforeEach(function () {
        var mockState = {};
        var mockPrevState = {};
        var mockUsers = {};
        module('flapperNews', function ($provide) {
            $provide.value('$state', mockState);
            $provide.value('prevState', mockPrevState);
            $provide.value('users', mockUsers);
        })
        
        mockState.go = function (name, params) {
            currentState.name = name;
            currentState.params = params;
        }
        
        inject(function ($q) {
            mockUsers.logOut = function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        });

        inject(function ($rootScope, $controller, _$state_, _prevState_, _users_) {
            scope = $rootScope.$new();
            state = _$state_;
            users = _users_;
            prevState = _prevState_;
            ctrl = $controller('LogoutCtrl', { $scope: scope, $state: state, prevState: prevState, users: users });
        })
    })

    it('should not do anything before response', function () {
        expect(currentState.name).toBe(undefined);
        expect(currentState.params).toBe(undefined);
    })
    
    describe('should go to "/home/1" if previous state was', function () {
        var expectedState = { name: 'home', params: { page: 1 } };
        
        it('"posts-create"', function () {
            prevState.name = 'posts-create';
            scope.$apply();
            expect(currentState.name).toBe(expectedState.name);
            expect(currentState.params).toEqual(expectedState.params);
        })
        
        it('"account"', function () {
            prevState.name = 'account';
            scope.$apply();
            expect(currentState.name).toBe(expectedState.name);
            expect(currentState.params).toEqual(expectedState.params);
        })
    })

    it('should go to previous state if previous state is allowed for logout user', function () {
        var expectedState = { name : 'expected', params : { param1: {}, param2: 1234} };
        prevState.name = expectedState.name;
        prevState.params = {};
        prevState.params.param1 = expectedState.params.param1;
        prevState.params.param2 = expectedState.params.param2;

        scope.$apply();
        expect(currentState.name).toBe(expectedState.name);
        expect(currentState.params).toEqual(expectedState.params);
    })


})