'use strict'

describe('users', function () {
    var httpBackend, users;
    
    beforeEach(module('flapperNews'));
    beforeEach(inject(function (_users_, $httpBackend) {
        users = _users_;
        httpBackend = $httpBackend;
    }))
    
    beforeEach(function () {
        inject(function ($rootScope) {
            spyOn($rootScope, '$broadcast').and.callFake(function () { });
        })
    })
    
    describe('on start', function () {
        it('should have empty user data', function () {
            expect(users.user).toBe(undefined);
        })
    })
    
    describe('on checking if user is admin', function () {
        it('should return true if rights are "admin"', function () {
            users.user = { rights: 'admin' };
            expect(users.isAuthorized()).toEqual(true);
        })
        it('shoudl return false if user not logged in', function () {
            expect(users.isAuthorized()).toEqual(false);
        })
        it('shoudl return false if user has different rights', function () {
            users.user = {};
            expect(users.isAuthorized()).toEqual(false);
        })
    })
    
    var expectAuthenticated = function (user) {
        expect(users.user).not.toBe(undefined);
        if (users.user) {
            expect(users.user.username).toBe(user.username);
            expect(users.user.password).toBe(user.password);
            expect(users.user.firstName).toBe(user.firstName);
            expect(users.user.lastName).toBe(user.lastName);
            expect(users.user.email).toBe(user.email);
        }
    }
    
    var expectNotAuthenticated = function (user) {
        expect(users.user).toBe(undefined);
    }
    
    var mockUser = 
 { username: 'username', password: 'password', firstName: 'firstname', lastName: 'lastname', email: 'email' };

    describe('on login attempt', function () {
        beforeEach(function () {
            httpBackend.whenPOST('/login').respond(function (method, url, data) {
                var received = angular.fromJson(data);
                if (received.username === mockUser.username && received.password === mockUser.password)
                    return [200, mockUser, {}];
                return [400, {}, {}];
            })
        })
        it('should assing user values when login succeeds', function () {
            users.authenticate(mockUser.username, mockUser.password);
            httpBackend.flush();
            expectAuthenticated(mockUser);
        })
        it('should not change user values when login fails', function () {
            users.authenticate('fake', 'fake');
            httpBackend.flush();
            expectNotAuthenticated();
        })
    })

    describe('on signup attempt', function () {
        beforeEach(function () {
            httpBackend.whenPOST('/account').respond(function (method, url, data) {
                var received = angular.fromJson(data);
                if (received.username == mockUser.username)
                    return [200, mockUser, {}];
                return [400, {}, {}];
            })
        })

        it('should assign user values when signup succeeds', function (){
            users.signup(mockUser.username, mockUser.password, mockUser.firstName, mockUser.lastName, mockUser.email);
            httpBackend.flush();
            expectAuthenticated(mockUser);
        })

        it('should not assign user values when signup fails', function () {
            users.signup('fail', 'fail', 'fail', 'fail', 'fail');
            httpBackend.flush();
            expectNotAuthenticated();
        })
    })

    describe('on logout', function (){
        it('should clear user data', function () {
            httpBackend.whenGET('/logout').respond(200, {});
            users.logOut();
            httpBackend.flush();
            expect(users.user).toBe(undefined);
        })
    })

    describe('on fetching user from server', function (){
        it('should assign user values if logged in', function () {
            httpBackend.whenGET('/account').respond(200, mockUser);
            users.fetchUser();
            httpBackend.flush();
            expectAuthenticated(mockUser);
        })
        it('should not change user if not logged in', function (){
            httpBackend.whenGET('/account').respond(400, {});
            users.fetchUser();
            httpBackend.flush();
            expectNotAuthenticated();
        })
    })


})