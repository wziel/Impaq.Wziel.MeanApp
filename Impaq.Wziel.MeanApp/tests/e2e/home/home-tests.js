var AngularHomePage = require('./home.page-object.js');
var AngularLoginPage = require('../login/login.page-object.js');
var AngularNavbar = require('../navbar/navbar.page-object.js');

describe("Home", function () {
    var home = new AngularHomePage();
    var navbar = new AngularNavbar();
    var login = new AngularLoginPage();
    
    beforeEach(function () {
        home.get();
        navbar.logOut();
    })
    
    it('should have posts displayed', function () {
        expect(home.posts.elements.count()).toBeGreaterThan(0);
    })
    
    it('should have links and upvotes displayed for each post', function () {
        home.posts.elements.count().then(function (count) {
            while (--count >= 0) {
                var post = home.posts.element(count);
                expect(post.btnDetails.isDisplayed()).toEqual(true);
                expect(post.lblLikes.isDisplayed()).toEqual(true);
            }
        });
    })

    it('should redirect to post page after clicking details link', function () {
        home.posts.elements.count().then(function (count) {
            while (--count >= 0) {
                home.get();
                home.posts.element(count).btnDetails.click();
                expect(browser.getLocationAbsUrl()).toMatch("posts");
            }
        });
    })
    
    describe("on logged out", function () {
        it('should not have like button displayed', function () {
            expect(home.posts.element(0).likeDiv.element.isDisplayed()).toEqual(false);
        })
        it('souhld not have delete button displayed', function () {
            expect(home.posts.element(0).btnDelete.isDisplayed()).toEqual(false);
        })
    })
    
    var expectPossibleLikeDislike = function () {
        describe("should be able to like and dislike a post", function () {
            var liked;
            var likes;
            var element;
            beforeEach(function () {
                element = home.posts.element(0);
                element.likeDiv.btnDislike.isDisplayed().then(function (displayed) {
                    liked = displayed;
                })
                element.lblLikes.getText().then(function (text) {
                    likes = parseInt(text);
                });
            })
            for (var i = 0; i < 2; ++i) {
                it('', function () {
                    expect(element.likeDiv.btnDislike.isDisplayed()).toEqual(liked);
                    expect(element.likeDiv.btnLike.isDisplayed()).toEqual(!liked);
                    if (liked) {
                        element.likeDiv.btnDislike.click();
                        likes--;
                    }
                    else {
                        element.likeDiv.btnLike.click();
                        likes++;
                    }
                    expect(element.likeDiv.btnDislike.isDisplayed()).toEqual(!liked);
                    expect(element.likeDiv.btnLike.isDisplayed()).toEqual(liked);
                    element.lblLikes.getText().then(function (currLikes) {
                        expect(parseInt(currLikes)).toEqual(likes);
                    })
                })
            }
        })
    }
    
    describe("on logged in as user", function () {
        beforeEach(function () {
            login.get();
            login.logInUser();
            home.get();
        })
        
        it('should have like button displayed', function () {
            expect(home.posts.element(0).likeDiv.element.isDisplayed()).toEqual(true);
        })
        it('should not have delete button displayed', function () {
            expect(home.posts.element(0).btnDelete.isDisplayed()).toEqual(false);
        })

        expectPossibleLikeDislike();
    })
    
    describe("on logged in as admin", function () {
        beforeEach(function () {
            login.get();
            login.logInAdmin();
            home.get();
        })
        
        it('should have like button displayed', function () {
            expect(home.posts.element(0).likeDiv.element.isDisplayed()).toEqual(true);
        })
        it('should have delete button displayed', function () {
            expect(home.posts.element(0).btnDelete.isDisplayed()).toEqual(true);
        })
        
        it('should be able to delete a post', function () {
            home.posts.elements.count().then(function (count) {
                home.posts.element(0).btnDelete.click();
                browser.switchTo().alert().accept();
                home.posts.elements.count().then(function (newCount) {
                    expect(newCount).toEqual(count - 1);
                })
            })
        })

        expectPossibleLikeDislike();
    })
})