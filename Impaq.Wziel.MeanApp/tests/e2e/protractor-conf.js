exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'navbar/navbar-tests.js',
        'login/login-tests.js',
        'account/account-tests.js',
        'posts-create/posts-create-tests.js',
        'home/home-tests.js',
        'posts/posts-tests.js',
        'signup/signup-tests.js',
    ],
    capabilities: {
        'browserName' : 'chrome'
    }
};