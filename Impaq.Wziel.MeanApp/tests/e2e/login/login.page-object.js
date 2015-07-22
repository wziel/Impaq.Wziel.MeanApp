var AngularLogin = function() {
    this.getUser = function () { return { username: 'test', password: 'test', email: 'test@test', firstName: 'test', lastName: 'test' }; }
    this.getAdmin = function () { return { username: 'admin', password: 'admin', email: 'admin@admin', firstName: 'admin', lastName: 'admin' }; }
    this.getFake = function () { return { username: 'fake', password: 'fake', email: 'fake@fake', firstName: 'fake', lastName: 'fake' }; }
    this.getEmpty = function () { return { username: '', password: '', email: '', firstName: '', lastName: '' } }

    var admin = this.getAdmin();
    var user = this.getUser();
    var fake = this.getFake();
    
    this.txtUsername = element(by.model('username'));
    this.txtPassword = element(by.model('password'));
    this.btnSubmit = element(by.buttonText('Submit'));
    this.aSignup = element(by.css('#signup_link'));
    
    this.msgFailed = $('#msg-failed');
    
    this.get = function () {
        browser.get('http://localhost:9999/#/login'); 
    }

    this.logInUser = function () {
        return this.logIn(user.username, user.password);
    }
    this.logInAdmin = function () {
        return this.logIn(admin.username, admin.password);
    }
    this.logInFake = function () {
        return this.logIn(fake.username, fake.password);
    }
    this.logIn = function (username, password) {
        this.txtUsername.sendKeys(username);
        this.txtPassword.sendKeys(password);
        this.btnSubmit.click();
        return username;
    }
}
module.exports = AngularLogin;