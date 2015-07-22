var AngularNavbar = require('./navbar.page-object.js');
var LoginPage = require('../login/login.page-object.js');

describe('Navbar', function () {
    var navbar = new AngularNavbar();
    var links = navbar.links;
    beforeEach(function () {
        browser.get('http://localhost:9999/');
    })
    
    var expectText = function (name, element, value) {
        it('should have visible ' + name, function () {
            expect(element.getText()).toBe(value);
        })
    }
    
    var expectInvisible = function (name, element) {
        it('should have invisible ' + name, function () {
            expect(element.isDisplayed()).toBe(false);
        })
    }
    
    var expectLocation = function (name, clickableElement, location) {
        it('should go to ' + location + ' after clicking ' + name, function () {
            clickableElement.click();
            expect(browser.getLocationAbsUrl()).toEqual(location);
        })
    }
    
    var expectLocationOnLogout = function (url, location) {
        it('should go to ' + location + ' on logout, while being in ' + url, function () {
            navbar.logOut();
            expect(browser.getLocationAbsUrl()).toEqual(location);
        })
    }
    
    describe('on logged out', function () {
        expectText(links.title.name, links.title.element, links.title.text);
        expectText(links.home.name, links.home.element, links.home.text);
        expectText(links.login.name, links.login.element, links.login.text);
        expectText(links.signup.name, links.signup.element, links.signup.text);
        
        expectLocation(links.title.name, links.title.element, links.title.url);
        expectLocation(links.home.name, links.home.element, links.home.url);
        expectLocation(links.login.name, links.login.element, links.login.url);
        expectLocation(links.signup.name, links.signup.element, links.signup.url);
        
        expectInvisible(links.account.name, links.account.element);
        expectInvisible(links.newpost.name, links.newpost.element);
        expectInvisible(navbar.hello.name, navbar.hello.element);
    })
    describe('on logged in', function () {
        var login = new LoginPage();
        beforeEach(function () {
            navbar.logOut();
            login.get();
            login.logInUser();
        })
        expectText(links.title.name, links.title.element, links.title.text);
        expectText(links.home.name, links.home.element, links.home.text);
        expectText(links.logout.name, links.logout.element, links.logout.text);
        expectText(links.account.name, links.account.element, links.account.text);
        expectText(navbar.hello.name, navbar.hello.element, 'Hello, ' + login.getUser().username);
        
        expectLocation(links.title.name, links.title.element, links.title.url);
        expectLocation(links.home.name, links.home.element, links.home.url);
        expectLocation(links.account.name, links.account.element, links.account.url);
        
        expectLocationOnLogout(links.home.url, links.home.url);
        expectLocationOnLogout(links.account.url, links.home.url);
        
        expectInvisible(links.login.name, links.login.element);
        expectInvisible(links.signup.name, links.signup.element);
        expectInvisible(links.newpost.name, links.newpost.element);
    })
    
    describe('on logged in as admin', function () {
        var login = new LoginPage();
        beforeEach(function () {
            navbar.logOut();
            login.get();
            login.logInAdmin();
        })
        expectText(links.title.name, links.title.element, links.title.text);
        expectText(links.home.name, links.home.element, links.home.text);
        expectText(links.logout.name, links.logout.element, links.logout.text);
        expectText(links.account.name, links.account.element, links.account.text);
        expectText(links.newpost.name, links.newpost.element, links.newpost.text),
        expectText(navbar.hello.name, navbar.hello.element, 'Hello, ' + login.getAdmin().username);
        
        expectLocation(links.title.name, links.title.element, links.title.url);
        expectLocation(links.home.name, links.home.element, links.home.url);
        expectLocation(links.account.name, links.account.element, links.account.url);
        expectLocation(links.newpost.name, links.newpost.element, links.newpost.url);
        
        expectLocationOnLogout(links.home.url, links.home.url);
        expectLocationOnLogout(links.account.url, links.home.url);
        expectLocationOnLogout(links.newpost.url, links.home.url);

        expectInvisible(links.login.name, links.login.element);
        expectInvisible(links.signup.name, links.signup.element);
    })
    
})