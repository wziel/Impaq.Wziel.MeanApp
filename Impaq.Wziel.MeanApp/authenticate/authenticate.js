var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

//only user id is send over
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {
    if (req.user) {
        return done(null, false);
    }
    process.nextTick(function () {
        User.findOne({ username : username })
        .exec(function (err, user) {
            //error occured
            if (err) {
                return done(err);
            }
            //no user found
            if (!user) {
                return done(null, false);
            }
            //is password a match?
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        });
    });
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {
    if (req.user) {
        return done(null, false);
    }
    User.findOne({ username: username })
    .exec(function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false);
        }
        var newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email = req.param('email');
        newUser.firstName = req.param('firstName');
        newUser.lastName = req.param('lastName');
        newUser.save(function (err) {
            if (err) {
                //todo log
            }
            return done(null, newUser);
        });
    })
}));