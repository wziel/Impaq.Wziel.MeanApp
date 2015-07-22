'use strict'

describe('HomeCtrl', function () {
    var ctrl, scope, users, posts, page;
    
    beforeEach(function () {
        var mockPosts = {};
        var mockUsers = {};
        var mockPage = {};
        module('flapperNews', function ($provide) {
            $provide.value('posts', mockPosts);
            $provide.value('users', mockUsers);
            $provide.value('page', mockPage);
        });
        
        inject(function ($rootScope, $controller, _users_, _posts_, _page_) {
            scope = $rootScope.$new();
            users = _users_;
            posts = _posts_;
            page = _page_;
            ctrl = $controller('HomeCtrl', { $scope: scope, users: users, posts: posts, page: page })
        })
        
        mockPosts.posts = [
            {
                title: "Test title 1",
                body: "test body 1",
                upvotes: 17,
                upvoted: true,
                _id: 0
            },
            {
                title: "Test title 2",
                body: "test body 2",
                upvotes: 3,
                upvoted: false,
                _id: 1
            },
            {
                title: "Test title 3",
                body: "test body 3",
                upvotes: 0,
                upvoted: false,
                _id: 2
            },
            {
                title: "Test title 4",
                body: "test body 4",
                upvotes: 1,
                upvoted: true,
                _id: 3
            },
            {
                title: "Test title 5",
                body: "test body 5",
                upvotes: 45,
                upvoted: false,
                _id: 4
            },
        ];
        
        mockUsers.user = {
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            email: 'email'
        }
    })
    
    describe('HomeCtrl', function () {
        describe('on selecting post', function () {
            var mockPost = {
                title: "Test title 5",
                body: "test body 5",
                upvotes: 45,
                upvoted: false,
                _id: 4
            };
            var selectedPost = {};
            beforeEach(function () {
                selectedPost = {};
                posts.downvote = 
                posts.upvote =
                posts.delete = 
                function (post) {
                    selectedPost = post;
                }
            })
            afterEach(function () {
                expect(selectedPost).toBe(selectedPost);
            })
            describe('on voting down', function () {
                it('should downvote selected post', function () {
                    scope.decrementUpvotes(mockPost);
                })
            });
            
            describe('on voting up', function () {
                it('should upote selected post', function () {
                    scope.incrementUpvotes(mockPost);
                })
            });
            
            describe('on deleting', function () {
                it('should delete existing post', function () {
                    spyOn(window, 'confirm').and.callFake(function () {
                        return true;
                    })
                    scope.delete(mockPost);
                })
            })
        })
    })
})