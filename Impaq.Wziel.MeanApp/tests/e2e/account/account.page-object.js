var AngularAccountPage = function (){
    var page = this;
    
    this.get = function (){
        browser.get('http://localhost:9999/#/account');
    }

    this.dataDisplay = {
        name: $('#data-display').element(by.binding("user.firstName + ' ' + user.lastName")),
        username: $('#data-display').element(by.binding("user.username")),
        email: $('#data-display').element(by.binding("user.email")),
    }

    this.dataForm = {
        txtFirstName: $("#data-form").element(by.model("firstName")),
        txtLastName: $("#data-form").element(by.model("lastName")),
        txtEmail: $("#data-form").element(by.model("email")),
        btnSubmit: $("#data-form button"),
        
        msgSuccess: element.all(by.css("#data-form .positive")).first(),
        msgFail: element.all(by.css("#data-form .negative")).first(),

        submit: function (fname, lname, email){
            page.dataForm.txtFirstName.sendKeys(fname);
            page.dataForm.txtLastName.sendKeys(lname);
            page.dataForm.txtEmail.sendKeys(email);
            page.dataForm.btnSubmit.click();
        },
    }

    this.passForm = {
        txtOld: $("#pass-form").element(by.model("password.old")),
        txtNew1: $("#pass-form").element(by.model("password.new1")),
        txtNew2: $("#pass-form").element(by.model("password.new2")),
        btnSubmit: $("#pass-form button"),
        
        msgSuccess: element.all(by.css("#pass-form .positive")).first(),
        msgFail: element.all(by.css("#pass-form .negative")).first(),

        submit: function (old, new1, new2){
            page.passForm.txtOld.sendKeys(old);
            page.passForm.txtNew1.sendKeys(new1);
            page.passForm.txtNew2.sendKeys(new2);
            page.passForm.btnSubmit.click();
        }
    }
}

module.exports = AngularAccountPage;