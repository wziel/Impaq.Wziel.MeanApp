var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String, 
    firstName: String,
    lastName: String,
    rights: { type: String, default: 'user' }
});

//hash user password
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    
    var SALT_FACTOR = 5;
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

//check if password is a match
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    var user = this;
    bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
}

UserSchema.methods.isAdmin = function () {
    var user = this;
    return user.rights === 'admin';
}

UserSchema.methods.attachUpvotedFieldTo = function (collection) {
    var user = this;
    for (var i = 0; i < collection.length; ++i) {
        collection[i]._doc.upvoted = collection[i].isUpvotedBy(user);
    }
}

mongoose.model('User', UserSchema);