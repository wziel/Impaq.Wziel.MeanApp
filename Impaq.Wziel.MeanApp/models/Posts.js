var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    upvotes: { type: Number, default: 0 },
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    created: { type: Date, default: Date.now },
    body: {type: String}
});

PostSchema.methods.upvote = function (user, callback) {
    this.upvotes += 1;
    this.upvoters.push(user);
    this.save(callback);
}

PostSchema.methods.isUpvotedBy = function (user, callback) {
    for (var i = 0; i < this.upvoters.length; ++i) {
        if (this.upvoters[i].id === user._id.id) {
            return true;
        }
    }
    return false;
}

PostSchema.methods.downvote = function (user, callback) {
    this.upvotes -= 1;
    var index = this.upvoters.indexOf(user._id);
    this.upvoters[index] = this.upvoters[this.upvoters.length - 1];
    this.upvoters.pop();
    this.save(callback);
}

mongoose.model('Post', PostSchema);