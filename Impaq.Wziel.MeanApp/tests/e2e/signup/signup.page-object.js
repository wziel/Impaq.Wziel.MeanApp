var AngularSignupPage = function () {
    var page = this;
    
    this.get = function () {
        browser.get("http://localhost:9999/#/signup")
    }
    
    this.form = {
        txtUsername: element(by.model("username")),
        txtPassword: element(by.model("password")),
        txtFirstName: element(by.model("firstName")),
        txtLastName: element(by.model("lastName")),
        txtEmail: element(by.model("email")),
        btnSubmit: element(by.buttonText("Submit")),
        
        submit: function (username, password, fname, lname, email) {
            if (username)
                page.form.txtUsername.sendKeys(username);
            if (password)
                page.form.txtPassword.sendKeys(password);
            if (fname)
                page.form.txtFirstName.sendKeys(fname);
            if (lname)
                page.form.txtLastName.sendKeys(lname);
            if (email)
                page.form.txtEmail.sendKeys(email);
            page.form.btnSubmit.click();
        },
        
        msgFailed: $("form [ng-show='failed']"),
    }
}

module.exports = AngularSignupPage;