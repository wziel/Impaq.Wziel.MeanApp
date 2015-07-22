var AngularPostsPage = require('./posts.page-object.js');
var AngularLoginPage = require('../login/login.page-object.js');
var AngularNavbar = require('../navbar/navbar.page-object.js');
var AngularHome = require('../home/home.page-object.js');

describe("Posts", function () {
    var posts = new AngularPostsPage();
    var login = new AngularLoginPage();
    var navbar = new AngularNavbar();
    var home = new AngularHome();
    
    beforeEach(function () {
        posts.get();
        navbar.logOut();
    })

    describe("on logged out", function () {
        it("should not have like button displayed", function () {
            expect(posts.post.likeDiv.element.isDisplayed()).toEqual(false);
        })
        it("should have like count displayed", function () {
            expect(posts.post.lblLikes.isDisplayed()).toEqual(true);
        })
        it("should not have comment form displayed", function () {
            expect(posts.comments.form.element.isDisplayed()).toEqual(false);
        })
    })

    var expectPossibleLikeDislike = function (forPost) {
        describe("should be able to like and dislike a post", function () {
            var liked;
            var likes;
            var element;
            beforeEach(function () {
                //are we testing post or comment?
                element = forPost ? posts.post : posts.comments.element(0);

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
    
    var expectPossibleAddComment = function (){
        it("should be able to add post", function () {
            posts.comments.elements.count().then(function (count) {
                posts.comments.form.submit("komentarz");
                posts.comments.elements.count().then(function (newCount) {
                    expect(newCount).toEqual(count + 1);
                })
            })
        })
    }
    
    var expectPossibleDeleteComment = function (){
        it("should be able to delete post", function () {
            posts.comments.elements.count().then(function (count) {
                posts.comments.element(0).btnDelete.click();
                browser.switchTo().alert().accept();
                posts.comments.elements.count().then(function (newCount) {
                    expect(newCount).toEqual(count - 1);
                })
            })
        })
    }

    describe("on logged in as user", function () {
        beforeEach(function () {
            login.get();
            login.logInUser();
            posts.get();
        })
        
        it('should have like button displayed', function () {
            expect(posts.post.likeDiv.element.isDisplayed()).toEqual(true);
        })
        it('should not have delete button displayed', function () {
            expect(posts.post.btnDelete.isDisplayed()).toEqual(false);
        })
        it("should have comment form displayed", function () {
            expect(posts.comments.form.element.isDisplayed()).toEqual(true);
        })
        
        expectPossibleAddComment();
        expectPossibleLikeDislike(true);
        expectPossibleLikeDislike(false);
    })

    describe("on logged in as admin", function () {
        beforeEach(function () {
            login.get();
            login.logInAdmin();
            posts.get();
        })
        
        it('should have like button displayed', function () {
            expect(posts.post.likeDiv.element.isDisplayed()).toEqual(true);
        })
        it('should have delete button displayed', function () {
            expect(posts.post.btnDelete.isDisplayed()).toEqual(true);
        })
        it("should have comment form displayed", function () {
            expect(posts.comments.form.element.isDisplayed()).toEqual(true);
        })
        
        expectPossibleAddComment();
        expectPossibleLikeDislike(true);
        expectPossibleLikeDislike(false);
        expectPossibleDeleteComment();
    })
})