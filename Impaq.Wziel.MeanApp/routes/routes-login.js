var passport = require('passport');

module.exports = function (router) {
    
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/account',
        failureRedirect: '/authFail'
    }));
    
    router.get('/authFail', function (req, res, next) {
        res.send(false);
    });
    
    router.get('/logout', function (req, res, next) {
        req.logout();
        res.send(true);
    });
    
    router.get('/account', function (req, res, next) {
        if (req.user) {
            res.send({
                username: req.user.username,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                rights: req.user.rights
            });
        }
        else res.send({});
    });
    
    router.post('/account', passport.authenticate('signup', {
        successRedirect: '/account',
        failureRedirect: '/authFail'
    }));

    router.put('/account', function (req, res, next) {
        if (req.user === undefined || 
            (!req.body.firstName && !req.body.lastName && !req.body.email)) {
            res.send(false);
            return;
        }
        //change those that have value
        if(req.body.firstName)
            req.user.firstName = req.body.firstName;
        if (req.body.lastName)
            req.user.lastName = req.body.lastName;
        if (req.body.email)
            req.user.email = req.body.email;
        
        req.user.save(function (err) {
            if (err) {
                res.send({});
                return;
            }
            res.send({
                username: req.user.username,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            });
        })
    });
    
    router.put('/password', function (req, res, next) {
        if (req.user === undefined) {
            //signal some error
            res.send(false);
            return;
        }
        
        //check if password is a match. req.body.current is entered password.
        req.user.comparePassword(req.body.current, function (err, isMatch) {
            if (err) {
                return next(err);
            }
            if (!isMatch) {
                res.send(false);
                return;
            }
            req.user.password = req.body.requested;
            req.user.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.send(true);
            });
        });
    });
}