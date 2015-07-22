'use strict'

describe('LoginCtrl', function () {
    var ctrl, users, scope, location;
    beforeEach(function () {
        var mockUsers = {};
        var mockLocation = {};
        module('flapperNews', function ($provide) {
            $provide.value('users', mockUsers);
            $provide.value('$location', mockLocation);
        })
        
        inject(function ($rootScope, $controller, _users_, _$location_) {
            scope = $rootScope.$new();
            users = _users_;
            location = _$location_;
            ctrl = $controller('LoginCtrl', { $scope: scope, users: users, $location: location });
        })
    })
    
    it('on hideLoginFailed should set failed variable to false', function () {
        scope.failed = true;
        scope.hideLoginFailed();
        expect(scope.failed).toBe(false);
    })
    
    describe('on start', function () {
        it('should have empty username and password', function () {
            expect(scope.username).toBe('');
            expect(scope.password).toBe('');
        })
        
        it('should have not-failed and not-processing status', function () {
            expect(scope.failed).toBe(false);
            expect(scope.processing).toBe(false);
        })
    })
    
    describe('on login', function () {
        var user = {
            username: 'username',
            password: 'password'
        }
        
        beforeEach(function () {
            inject(function ($q) {
                users.authenticate = function (username, password) {
                    var deferred = $q.defer();
                    if (username === user.username && password === user.password) {
                        deferred.resolve(true);
                    }
                    else {
                        deferred.resolve(false);
                    }
                    return deferred.promise;
                }
            })
        })
        
        describe('failed', function () {
            beforeEach(function () {
                scope.username = 'test';
                scope.password = 'test';
                scope.login();
            })
            
            it('should set processing variable to false after response', function () {
                scope.$apply();
                expect(scope.processing).toBe(false);
            })
            
            it('should reset username and password after response', function () {
                scope.$apply();
                expect(scope.username).toBe('');
                expect(scope.password).toBe('');
            })
            
            it('should set failed variable to true', function () {
                scope.$apply();
                expect(scope.failed).toBe(true);
            })
        })
        
        describe('succeeded', function () {
            var currentLocation = {};
            beforeEach(function () {
                scope.username = user.username;
                scope.password = user.password;
                scope.login();
                location.path = function (path) {
                    currentLocation.path = path;
                }
            })
            
            it('should redirect to "/home/1"', function () {
                scope.$apply();
                expect(currentLocation.path).toBe('/home/1');
            })
        })
        
        it('should set processing variable to true before response', function () {
            scope.login();
            expect(scope.processing).toBe(true);
        })
    })
})