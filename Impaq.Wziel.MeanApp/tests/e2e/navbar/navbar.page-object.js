var AngularNavbar = function () {
    var navbar = this;
    var repeater = 'link in links';
    var column = 'title';
    this.links = {
        title: {
            element: $('.navbar-header').element(by.binding('title')),
            name: 'title link',
            text: 'Flapper news',
            url: '/home/1'
        },
        home: {
            element: element(by.repeater(repeater).row(0).column(column)),
            name: 'home link',
            text: 'Home',
            url: '/home/1'
        },
        account: {
            element: element(by.repeater(repeater).row(1).column(column)),
            name: 'account link',
            text: 'My Account',
            url: '/account'
        },
        logout: {
            element: element(by.repeater(repeater).row(2).column(column)),
            name: 'logout link',
            text: 'Log out',
            url: undefined //stay on current page, or redirect to /home/1
        },
        login: {
            element: element(by.repeater(repeater).row(3).column(column)),
            name: 'login link',
            text: 'Log in',
            url: '/login'
        },
        signup: {
            element: element(by.repeater(repeater).row(4).column(column)),
            name: 'signup link',
            text: 'Sign up',
            url: '/signup'
        },
        newpost: {
            element: element(by.repeater(repeater).row(5).column(column)),
            name: 'new post link',
            text: 'New Post',
            url: '/create'
        },
    }
    this.hello = {
        element : element(by.binding('user.username')),
        name: 'user hello',
    }
    
    this.logOut = function () {
        navbar.links.logout.element.isDisplayed().then(function (displayed) {
            if (displayed) {
                navbar.links.logout.element.click();
            }
        })
    }
}
module.exports = AngularNavbar;