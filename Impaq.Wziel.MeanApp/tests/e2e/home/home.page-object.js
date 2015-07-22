var AngularHomePage = function (){
    var page = this;

    this.get = function (){
        browser.get('http://localhost:9999/#/home');
    }

    this.posts = {
        elements: element.all(by.repeater("post in posts")),
        element: function (row){
            var element = page.posts.elements.get(row);
            element.likeDiv = {
                element: element.$("like-button [ng-show='interactive']"),
                btnLike: element.$("like-button [ng-click='like()']"),
                btnDislike: element.$("like-button [ng-click='unlike()']"),
            }
            element.btnDelete = element.$("delete-button");
            element.lblLikes = element.$("like-button").element(by.binding('count'));
            element.btnDetails = element.$("a");
            return element;
        }
    }
}

module.exports = AngularHomePage;