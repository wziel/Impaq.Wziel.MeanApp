var AngularAccountPage = require('./account.page-object.js');
var AngularLoginPage = require('../login/login.page-object.js');
var AngularNavbar = require('../navbar/navbar.page-object.js');
describe('Account Page', function () {
    var account = new AngularAccountPage();
    var login = new AngularLoginPage();
    var navbar = new AngularNavbar();
    
    var expectData = function (data) {
        expect(account.dataDisplay.name.getText()).toEqual(data.firstName + ' ' + data.lastName);
        expect(account.dataDisplay.username.getText()).toEqual(data.username);
        expect(account.dataDisplay.email.getText()).toEqual(data.email);
    }
    
    var expectResetDataMsg = function (){
        account.dataForm.txtFirstName.click();
        expect(account.dataForm.msgFail.isDisplayed()).toEqual(false);
        expect(account.dataForm.msgSuccess.isDisplayed()).toEqual(false);
    }
    
    var expectResetPassMsg = function (){
        account.passForm.txtOld.click();
        expect(account.passForm.msgFail.isDisplayed()).toEqual(false);
        expect(account.passForm.msgSuccess.isDisplayed()).toEqual(false);
    }
    
    var expectDataChange = function (success){
        expect(account.dataForm.msgFail.isDisplayed()).toEqual(!success);
        expect(account.dataForm.msgSuccess.isDisplayed()).toEqual(success);
    }
    
    var expectPassChange = function (success){
        expect(account.passForm.msgFail.isDisplayed()).toEqual(!success);
        expect(account.passForm.msgSuccess.isDisplayed()).toEqual(success);
    }
    
    var clearTxts = function (){
        account.passForm.txtOld.clear();
        account.passForm.txtNew1.clear();
        account.passForm.txtNew2.clear();
        account.dataForm.txtEmail.clear();
        account.dataForm.txtFirstName.clear();
        account.dataForm.txtLastName.clear();
    }
    
    beforeEach(function () {
        browser.get('http://localhost:9999/');
        navbar.logOut();
    })
    
    describe('on logged out', function () {
        beforeEach(function () {
            account.get();
        })

        it('should not be able to change data nor pass', function () {
            var fake = login.getFake();
            account.dataForm.submit(fake.firstName, fake.lastName, fake.email);
            expectDataChange(false);
            expectResetDataMsg();
            
            account.passForm.submit('old', 'new', 'new');
            expectPassChange(false);
            expectResetPassMsg();
        })
    })
    
    
    function loggedInTests(data) {
        it('should be able to change data and pass', function () {
            var newData = login.getFake();
            newData.username = data.old.username;
            
            account.dataForm.submit(newData.firstName, newData.lastName, newData.email);
            expectData(newData);
            expectDataChange(true);
            expectResetDataMsg();
            
            clearTxts();
            
            account.dataForm.submit(data.old.firstName, data.old.lastName, data.old.email);
            expectData(data.old);
            expectDataChange(true);
            expectResetDataMsg();
            
            account.passForm.submit(data.old.password, newData.password, newData.password);
            expectPassChange(true);
            expectResetPassMsg();
            
            clearTxts();
            
            account.passForm.submit(newData.password, data.old.password, data.old.password);
            expectPassChange(true);
            expectResetPassMsg();
        })
        
        it('should not be able to change data if none field is filled', function () {
            account.dataForm.btnSubmit.click();
            expectDataChange(false);
            expectResetDataMsg();
        })
        
        it('should not be able to change password if at least one value not provided', function () {
            account.passForm.submit('', 'new', 'new');
            expectPassChange(false);
            expectResetPassMsg();
            
            clearTxts();
            
            account.passForm.submit(data.old.password, '', 'new');
            expectPassChange(false);
            expectResetPassMsg();
            
            clearTxts();
            
            account.passForm.submit(data.old.password, 'new', '');
            expectPassChange(false);
            expectResetPassMsg();
        })
        
        it('should not be able to change password if old password is incorrect', function () {
            account.passForm.submit('incorrect-password', 'new', 'new')
            expectPassChange(false);
            expectResetPassMsg();
        })
        
        it('should not be able to change password if new passwords are different', function () {
            account.passForm.submit(data.old.password, 'first', 'second');
            expectPassChange(false);
            expectResetPassMsg();
        })
    }

    describe('on logged in as a user', function () {
        var data = {};
        beforeEach(function () {
            login.get();
            login.logInUser();
            account.get();
            data.old = login.getUser();
        })
        loggedInTests(data);
    })

    describe('on logged in as an admin', function () {
        var data = {};
        beforeEach(function () {
            login.get();
            login.logInAdmin();
            account.get();
            data.old = login.getAdmin();
        })
        loggedInTests(data);
    })
})