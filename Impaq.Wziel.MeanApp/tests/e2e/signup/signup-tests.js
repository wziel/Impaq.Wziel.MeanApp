var AngularLoginPage = require('../login/login.page-object.js');
var AngularNavbar = require('../navbar/navbar.page-object.js');
var AngularSignupPage = require('./signup.page-object.js');

describe("Signup", function (){
    var login = new AngularLoginPage();
    var navbar = new AngularNavbar();
    var signup = new AngularSignupPage();

    beforeEach(function () {
        signup.get();
        navbar.logOut();
        signup.get();
    })
    
    var expectHomePage = function (){
        expect(browser.getLocationAbsUrl()).toEqual("/home/1");
    }
    
    var expectSignupFailed = function (){
        expect(signup.form.msgFailed.isDisplayed()).toEqual(true);
    }

    describe("on logged out", function () {
        it("should signup when unique username and password provided", function () {
            var credentials = Math.random();
            signup.form.submit(credentials, credentials);
            expectHomePage();
        })
        it("should not signup when existing username provided", function () {
            signup.form.submit("test", "test", "test", "test", "test")
            expectSignupFailed();
        })
        it("should not signup when no username provided", function () {
            signup.form.submit('', "test", "test", "test", "test");
            expectSignupFailed();
        })
        it("should not signup when no password provided", function () {
            signup.form.submit("test", '', "test", "test", "test");
            expectSignupFailed();
        })
    })
    
    describe("on logged in as user", function () {
        beforeEach(function () {
            login.get();
            login.logInUser();
            signup.get();
        })
        it("should not be able to sign up with unique username and password", function () {
            var credentials = Math.random();
            signup.form.submit(credentials, credentials);
            expectSignupFailed();
        })
    })

    describe("on logged in as admin", function () {
        beforeEach(function () {
            login.get();
            login.logInAdmin();
            signup.get();
        })
        it("should not be able to sign up with unique username and password", function () {
            var credentials = Math.random();
            signup.form.submit(credentials, credentials);
            expectSignupFailed();
        })
    })
})