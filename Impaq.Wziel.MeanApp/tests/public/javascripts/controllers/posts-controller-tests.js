'use strict'

describe('PostsCtrl', function () {
    var ctrl, scope, location, posts, post, page, users;
    
    beforeEach(function () {
        var mockLocation = {};
        var mockPosts = {};
        var mockPage = {};
        var mockUsers = {};
        var mockPost = {
            title: "Test title 1",
            body: "test body 1",
            upvotes: 17,
            upvoted: true,
            _id: 0,
            comments: [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 3 }]
        };
        
        module('flapperNews', function ($provide) {
            $provide.value('$location', mockLocation);
            $provide.value('posts', mockPosts);
            $provide.value('page', mockPage);
            $provide.value('post', mockPost);
            $provide.value('users', mockUsers);
        })
        
        mockUsers.user = {
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            email: 'email'
        }
        
        
        inject(function ($rootScope, $controller, _$location_, _posts_, _post_, _page_, _users_) {
            scope = $rootScope.$new();
            location = _$location_;
            posts = _posts_;
            post = _post_;
            page = _page_;
            users = _users_;
            ctrl = $controller('PostsCtrl', {
                $scope: scope, 
                $location: location, 
                posts: posts, 
                post: post, 
                page: page, 
                users: users
            });
        })
    })
    
    describe('on start', function () {
        it('should have empty comment body', function () {
            expect(scope.body).toEqual('');
        })
        it('should have mock user assigned', function () {
            expect(scope.user).toEqual(users.user);
        })
    })
    
    describe('on user updated', function () {
        beforeEach(function () {
            users.user = {
                firstName: 'changed',
                lastName: 'changed',
                username: 'changed',
                email: 'changed'
            }
        })
        it('should not update controller user when event not called', function () {
            expect(scope.user.firstName).toBe('firstName');
            expect(scope.user.lastName).toBe('lastName');
            expect(scope.user.email).toBe('email');
            expect(scope.user.username).toBe('username');
        })
        it('should update controller user when event called', function () {
            scope.$broadcast('user:updated', users.user);
            expect(scope.user.firstName).toBe('changed');
            expect(scope.user.lastName).toBe('changed');
            expect(scope.user.email).toBe('changed');
            expect(scope.user.username).toBe('changed');
        })
    })
    
    describe('on post', function () {
        var selectedPost;
        beforeEach(function () {
            selectedPost = {};
            posts.upvote = 
                posts.downvote =
                posts.delete = 
                    function (post) {
                selectedPost = post;
            }
        })
        describe('delete', function () {
            var locationPath;
            beforeEach(function () {
                spyOn(window, 'confirm').and.callFake(function () { return true; });
                location.path = function (path) {
                    locationPath = path;
                }
                scope.deletePost();
            })
            it('should redirect to "/home/1" on delete', function () {
                expect(locationPath).toBe("/home/1");
            })
            it('should delete current post', function () {
                expect(selectedPost).toEqual(post);
            })
        })
        
        describe('vote', function () {
            afterEach(function () {
                expect(selectedPost).toBe(post);
            })
            it('should upvte current post', function () {
                scope.incrementUpvotesForPost();
            })
            it('should downvote current post', function () {
                scope.decrementUpvotesForPost();
            })
        })
    })
    
    describe('on comment', function () {
        describe('add', function () {
            var commentCount;
            var addedComment;
            var post_id;
            beforeEach(function () {
                inject(function ($q) {
                    posts.addComment = function (postId, comment) {
                        var deferred = $q.defer();
                        if (comment.body && comment.author && postId) {
                            post_id = postId;
                            addedComment = comment;
                            deferred.resolve(true);
                        }
                        else {
                            deferred.resolve(false);
                        }
                        return deferred.promise;
                    }
                })
                commentCount = scope.post.comments.length;
            })
            it('should not add comment with empty body', function () {
                scope.body = '';
                scope.addComment();
                scope.$apply();
                expect(commentCount).toEqual(scope.post.comments.length);
            })
            it('should add comment with not empty body', function () {
                var body = 'body';
                scope.body = body;
                scope.addComment();
                scope.$apply();
                expect(commentCount).toEqual(scope.post.comments.length - 1);
            })
        })
        describe('voting', function () {
            var mockComment = {};
            var selectedComment;
            beforeEach(function () {
                selectedComment = {};
                posts.upvoteComment = 
                posts.downvoteComment =
                function (post, comment) {
                    selectedComment = comment;
                }
            })
            afterEach(function () {
                expect(selectedComment).toBe(mockComment);
            })
            it('up should upvote selected comment', function () {
                scope.incrementUpvotes(mockComment);
            });
            it('down should downpvote selected comment', function () {
                scope.decrementUpvotes(mockComment);
            });
        })
        describe('delete', function () {
            var toDelete = {};
            var deleted = {};
            beforeEach(function () {
                toDelete = post.comments[1];
                deleted = {};
                spyOn(window, 'confirm').and.callFake(function () { return true; })
                inject(function ($q) {
                    
                    posts.deleteComment = function (comment) {
                        deleted = comment;
                        var deferred = $q.defer();
                        for (var i = 0; i < post.comments.length; ++i) {
                            if (post.comments[i]._id == comment._id) {
                                deferred.resolve({ data: true });
                                return deferred.promise;
                            }
                        }
                        deferred.resolve({ data: false });
                        return deferred.promise;
                    }
                })
            })
            it('should call delete with specified comment', function () {
                scope.delete(toDelete);
                expect(deleted).toBe(toDelete);
            })
            it('should remove specified comment from collection', function () {
                var count = scope.post.comments.length;
                scope.delete(toDelete);
                scope.$apply();
                expect(scope.post.comments.length).toBe(count - 1);
                for (var i = 0; i < scope.post.comments.length; ++i) {
                    expect(scope.post.comments[i]).not.toBe(toDelete);
                }
            })
            it('should not remove comments from collection when fake comment deleted', function () {
                var count = scope.post.comments.length;
                scope.delete({_id: 1324});
                scope.$apply();
                expect(scope.post.comments.length).toBe(count);
            })
        })
    })
})