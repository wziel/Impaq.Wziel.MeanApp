var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: { type: Number, default: 0 },
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created: { type: Date, default: Date.now}
});

CommentSchema.methods.upvote = function (user, callback) {
    this.upvotes += 1;
    this.upvoters.push(user);
    this.save(callback);
}

CommentSchema.methods.isUpvotedBy = function (user) {
    for (var i = 0; i < this.upvoters.length; ++i) {
        if (this.upvoters[i].id === user._id.id) {
            return true;
        }
    }
    return false;
}

CommentSchema.methods.downvote = function (user, callback) {
    this.upvotes -= 1;
    var index = this.upvoters.indexOf(user._id);
    this.upvoters[index] = this.upvoters[this.upvoters.length - 1];
    this.upvoters.pop();
    this.save(callback);
}

mongoose.model('Comment', CommentSchema);