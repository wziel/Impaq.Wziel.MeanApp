var AngularHome = require('../home/home.page-object.js');

var AngularPostsPage = function () {
    page = this;
    
    this.get = function () {
        var home = new AngularHome();
        home.get();
        home.posts.element(0).btnDetails.click();
    }
    
    this.post = {
        element: $(".page-header"), 
        likeDiv: {
            element: $(".page-header like-button [ng-show='interactive']"),
            btnLike: $(".page-header like-button [ng-click='like()']"),
            btnDislike: $(".page-header like-button [ng-click='unlike()']"),
        },
        btnDelete: $(".page-header delete-button"),
        lblLikes: $(".page-header like-button").element(by.binding('count'))
    }
    
    this.comments = {
        elements: element.all(by.repeater("comment in post.comments")),
        
        element: function (row) {
            var element = page.comments.elements.get(row);
            element.likeDiv = {
                element: element.$("like-button [ng-show='interactive']"),
                btnLike: element.$("like-button [ng-click='like()']"),
                btnDislike: element.$("like-button [ng-click='unlike()']"),
            }
            element.btnDelete = element.$("delete-button");
            element.lblLikes = element.$("like-button").element(by.binding('count'));
            return element;
        },
        
        form: {
            element: $("form"),
            body: element(by.model('body')),
            btnSubmit: $("form button"),
            
            submit: function (body) {
                page.comments.form.body.sendKeys(body);
                page.comments.form.btnSubmit.click();
            }
        }
    }
}

module.exports = AngularPostsPage;