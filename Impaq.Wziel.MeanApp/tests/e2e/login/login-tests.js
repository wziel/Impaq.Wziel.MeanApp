var AngularLoginPage = require('./login.page-object.js');
var AngularNavbar = require('../navbar/navbar.page-object.js');

describe('Login Page', function () {
    var login = new AngularLoginPage();
    var navbar = new AngularNavbar();
    
    describe('on logged out', function (){
        beforeEach(function () {
            navbar.logOut();
            login.get();
        })
        
        it('should login when user provided', function () {
            login.logInUser();
            expect(navbar.hello.element.isDisplayed()).toEqual(true);
        })
        
        it('should login when admin provided', function () {
            login.logInAdmin();
            expect(navbar.hello.element.isDisplayed()).toEqual(true);
        })
        
        it('should not login when fake user provided', function () {
            login.logInFake();
            expect(navbar.hello.element.isDisplayed()).toEqual(false);
        })
        
        it('shoudl redirect to signup page after clicking signup', function () {
            login.aSignup.click();
            expect(browser.getLocationAbsUrl()).toEqual('/signup');
        })
    })
    
    var loggedInTests = function (){
        it('should not login when user provided', function () {
            login.logInUser();
            expect(login.msgFailed.isDisplayed()).toEqual(true);
        })
        
        it('should not login when admin provided', function () {
            login.logInAdmin();
            expect(login.msgFailed.isDisplayed()).toEqual(true);
        })
        
        it('should not login when fake user provided', function () {
            login.logInFake();
            expect(login.msgFailed.isDisplayed()).toEqual(true);
        })
        
        it('shoudl redirect to signup page after clicking signup', function () {
            login.aSignup.click();
            expect(browser.getLocationAbsUrl()).toEqual('/signup');
        })
    }

    describe('on logged in as user', function () {
        beforeEach(function () {
            navbar.logOut();
            login.get();
            login.logInUser();
            login.get();
        })
        loggedInTests();
    })
    
    describe('on logged in as admin', function () {
        beforeEach(function () {
            navbar.logOut();
            login.get();
            login.logInAdmin();
            login.get();
        })
        loggedInTests();
    })
})