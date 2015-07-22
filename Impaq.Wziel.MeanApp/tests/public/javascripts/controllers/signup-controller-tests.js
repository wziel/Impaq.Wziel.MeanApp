'use strict'

describe('SignupCtrl', function () {
    var ctrl, scope, location, users;

    beforeEach(function () {
        var mockUsers = {};
        var mockLocation = {};
        module('flapperNews', function ($provide) {
            $provide.value('users', mockUsers);
            $provide.value('$location', mockLocation);
        })

        inject(function ($rootScope, $controller, _$location_, _users_) {
            scope = $rootScope.$new();
            location = _$location_;
            users = _users_;
            ctrl = $controller('SignupCtrl', { $scope: scope, $location: location, users: users });
        })
    })

    describe('on start', function () {
        it('should have empty values', function () {
            expect(scope.username ).toEqual('');
            expect(scope.password).toEqual('');
            expect(scope.email).toEqual('');
            expect(scope.firstName).toEqual('');
            expect(scope.lastName).toEqual('');
        })
        
        it('should have not-failed and not-processing status', function () {
            expect(scope.failed).toBe(false);
            expect(scope.processing).toBe(false);
        }) 
    })
    
    describe('on signup', function () {
        var forbidden = {
            username: 'forbid-username'
        }
        var allowed = {
            username: 'allowed'
        }
        
        beforeEach(function () {
            inject(function ($q) {
                users.signup = function (username, password, firstName, lastName, email) {
                    var deferred = $q.defer();
                    if (username === forbidden.username) {
                        deferred.resolve(false);
                    }
                    else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                }
            })
        })
        
        describe('failed', function () {
            beforeEach(function () {
                scope.username = forbidden.username;
                scope.signup();
                scope.$apply();
            })
            
            it('should set processing variable to false after response', function () {
                expect(scope.processing).toBe(false);
            })
            
            it('should reset values after response', function () {
                expect(scope.username).toEqual('');
                expect(scope.password).toEqual('');
                expect(scope.email).toEqual('');
                expect(scope.firstName).toEqual('');
                expect(scope.lastName).toEqual('');
            })
            
            it('should set failed variable to true', function () {
                expect(scope.failed).toBe(true);
            })
        })
        
        describe('succeeded', function () {
            var currentLocation = {};
            beforeEach(function () {
                scope.username = 
                scope.signup();
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
            scope.signup();
            expect(scope.processing).toBe(true);
        })
    })
})