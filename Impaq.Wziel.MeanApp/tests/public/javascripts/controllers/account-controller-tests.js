'use strict'

describe('AccountCtrl', function () {
    var scope, ctrl, users;

    beforeEach(function () {
        var mockUserService = {};
        module('flapperNews', function ($provide) {
            $provide.value('users', mockUserService);
        })
        
        mockUserService.user = {
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            email: 'email'
        }
        mockUserService.fetchUser = function () { }

        inject(function ($rootScope, $controller, _users_) {
            scope = $rootScope.$new();
            scope.dataForm = { $valid: true };
            users = _users_;
            ctrl = $controller('AccountCtrl', { $scope: scope, users: users });
        });
    });

    describe('on start', function () {
        it('should have mock user values', function () {
            expect(scope.user.firstName).toBe('firstName');
            expect(scope.user.lastName).toBe('lastName');
            expect(scope.user.email).toBe('email');
            expect(scope.user.username).toBe('username');
        });
        it('should have empty password values inserted', function () {
            expect(scope.password.new1).toBe('');
            expect(scope.password.new2).toBe('');
            expect(scope.password.old).toBe('');
        });
        it('should have empty user values inserted', function () {
            expect(scope.firstName).toBe('');
            expect(scope.lastName).toBe('');
            expect(scope.email).toBe('');
        });
    })
    
    describe('on user updated', function () {
        beforeEach(function () {
            users.user = {
                firstName: 'changed',
                lastName: 'changed',
                username: 'changed',
                email: 'changed'
            }
        })
        it('should not update controller user when event not called', function () {
            expect(scope.user.firstName).toBe('firstName');
            expect(scope.user.lastName).toBe('lastName');
            expect(scope.user.email).toBe('email');
            expect(scope.user.username).toBe('username');
        })
        it('should update controller user when event called', function () {
            scope.$broadcast('user:updated', users.user);
            expect(scope.user.firstName).toBe('changed');
            expect(scope.user.lastName).toBe('changed'); 
            expect(scope.user.email).toBe('changed');
            expect(scope.user.username).toBe('changed');
        })
    })

    describe('on edit', function () {
        describe('data, ', function () {

            beforeEach(function () {
                inject(function ($q) {
                    users.edit = function (firstName, lastName, email) {
                        var deferred = $q.defer();
                        if (firstName || lastName || email) {
                            deferred.resolve(true);
                            if (firstName)
                                users.firstName = firstName;
                            if (lastName)
                                users.lastName = lastName;
                            if (email)
                                users.email = email;
                        }
                        else {
                            deferred.resolve(false);
                        }
                        return deferred.promise;
                    };
                });
            });
            
            var execute_and_expect_success = function (success) {
                scope.submit_data();
                scope.$apply();
                expect(scope.data_fail).toBe(!success);
                expect(scope.data_succ).toBe(success);
            }

            it('should fail if none inserted', function () {
                execute_and_expect_success(false);
            })
            
            it('should succeed if firstName inserted', function () {
                scope.firstName = 'test';
                execute_and_expect_success(true);
            })
            
            it('should succeed if lastName inserted', function () {
                scope.lastName = 'test';
                execute_and_expect_success(true);
            })
            
            it('should succeed if email inserted', function () {
                scope.email = 'test';
                execute_and_expect_success(true);
            })

        })
        
        describe('password, ', function () {
            
            beforeEach(function () {
                var password = 'password';

                inject(function ($q) {
                    users.changePass = function (oldPass, newPass) {
                        var deferred = $q.defer();
                        if (oldPass && newPass && oldPass === password) {
                            deferred.resolve(true);
                            password = newPass;
                        }
                        else {
                            deferred.resolve(false);
                        }
                        return deferred.promise;
                    };
                });
            });
            
            var execute_and_expect_success = function (success) {
                scope.submit_pass();
                scope.$apply();
                expect(scope.password.fail).toBe(!success);
                expect(scope.password.succ).toBe(success);
            }

            it('should fail if one not inserted', function () {
                scope.passForm = { $valid: false };
                execute_and_expect_success(false);
            })

            it('should fail if old password wrong', function () {
                scope.password.old = "wrong_password";
                scope.password.new1 = "correct";
                scope.password.new2 = "correct";
                scope.passForm = { $valid: true };
                execute_and_expect_success(false);
            })

            it('should fail if new passwords are differenet', function () {
                scope.password.old = "password";
                scope.password.new1 = "first";
                scope.password.new2 = "second";
                scope.passForm = { $valid: false };
                execute_and_expect_success(false);
            })

            it('shoudl succeed if new passwords are the same and old correct', function () {
                scope.password.old = "password";
                scope.password.new1 = "correct";
                scope.password.new2 = "correct";
                scope.passForm = { $valid: true };
                execute_and_expect_success(true);
            })
        })
    })
})