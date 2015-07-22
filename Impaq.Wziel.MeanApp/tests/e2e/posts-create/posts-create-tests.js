var PostsCreatePage = require("./posts-create.page-object.js");
var AngularLoginPage = require('../login/login.page-object.js');
var AngularNavbar = require('../navbar/navbar.page-object.js');

describe('PostsCreate Page', function () {
    var page = new PostsCreatePage();
    var navbar = new AngularNavbar();
    var login = new AngularLoginPage();
    
    beforeEach(function () {
        browser.get('http://localhost:9999/');
        navbar.logOut();
    })

    describe('on logged out', function () {
        beforeEach(function () {
            page.get();
        })

        it("should not display failed message before submitting", function () {
            expect(page.form.lblFailed.isDisplayed()).toEqual(false);
        })

        it("should not be able to submit post", function () {
            page.form.submit("title", "body");
            expect(page.form.lblFailed.isDisplayed()).toEqual(true);
        })
    })

    describe('on logged in as a user', function () {
        beforeEach(function () {
            login.get();
            login.logInUser();
            page.get();
        })
        
        it("should not display failed message before submitting", function () {
            expect(page.form.lblFailed.isDisplayed()).toEqual(false);
        })
        
        it("should not be able to submit post", function () {
            page.form.submit("title", "body");
            expect(page.form.lblFailed.isDisplayed()).toEqual(true);
        })
    })

    describe("on logged in as an admin", function () {
        beforeEach(function (){
            login.get();
            login.logInAdmin();
            page.get();
        })

        it("should not display failed message", function () {
            expect(page.form.lblFailed.isDisplayed()).toEqual(false);
        })

        it("should redirect to post page after submitting form", function () {
            var post = {
                title: "protractor title",
                body: "protractor body",
            };
            
            page.form.submit(post.title, post.body);
            var state = browser.getLocationAbsUrl();
            expect(state).toMatch("posts")
        })
    })
})