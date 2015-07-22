var AngularCreatePostPage = function () {
    var page = this;
    
    this.get = function () {
        browser.get('http://localhost:9999/#/create');
    }
    
    this.form = {
        txtTitle: element(by.model("title")),
        txtBody: element(by.model("body")),
        btnSubmit: $("button"),
        lblFailed: $("#msg-failed"),
        
        submit: function (title, body) {
            page.form.txtTitle.sendKeys(title);
            page.form.txtBody.sendKeys(body);
            page.form.btnSubmit.click();
        }
    }
}

module.exports = AngularCreatePostPage;