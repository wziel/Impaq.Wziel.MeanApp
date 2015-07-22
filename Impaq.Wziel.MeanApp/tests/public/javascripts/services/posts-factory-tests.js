'use strict'

describe('posts', function (){
    var httpBackend, posts;

    beforeEach(module('flapperNews'));
    beforeEach(inject(function (_posts_, $httpBackend) {
        posts = _posts_;
        httpBackend = $httpBackend;
    }))

    describe('on start', function () {
        it('should have no posts', function () {
            expect(posts.posts.length).toEqual(0);
        })
        it('should have all posts count equal to zero',function(){
            expect(posts.allCount).toEqual(0);
        })
    })

    it('should get all posts count', function () {
        var count = 5;
        httpBackend.whenGET('/posts/count').respond(200, count);
        posts.getAllCount();
        expect(posts.allCount).toEqual(0);
        httpBackend.flush();
        expect(posts.allCount).toEqual(count);
    })

    it('should copy all send posts on getPage', function () {
        var data = { posts: [{}, {}, {}, {}, {}] }
        httpBackend.whenGET('/posts/' + posts.postsPerPage + '/1').respond(200, data);
        posts.getPage(1);
        expect(posts.posts.length).toEqual(0);
        httpBackend.flush();
        expect(posts.posts.length).toEqual(data.posts.length);
    })
    
    it('should send created post to server', function () {
        var post = { id: '{E9032546-81B1-480F-BE9F-B20168D05841}' };
        httpBackend.whenPOST('/posts').respond(function (method, url, data) {
            var received = angular.fromJson(data);
            expect(post.id).toEqual(received.id);
            return [200, received, {}];
        })
        posts.create(post);
        httpBackend.flush();
    })
    
    describe('on post deleting', function (){
        var toDelete = {};
        beforeEach(function (){
            posts.posts = [{ _id: 234 }, { _id: 1234 }, { _id: 7654 }, { _id: 2346524 }];
            toDelete = posts.posts[2];
            
            httpBackend.whenDELETE('/posts/' + toDelete._id).respond(function (method, url) {
                return [200, {}, {}];
            })
        })
        it('should remove deleted post from posts', function () {
            expect(posts.posts.length).toEqual(4);
            posts.delete(toDelete);
            httpBackend.flush();
            expect(posts.posts.length).toEqual(3);
        })
    })
    
    it('shoudl call server method to get comments for post', function () {
        var id = "{A18137A6-788F-46A4-852F-DB2F93DB85FD}";
        var page = 2;
        var called = false;
        httpBackend.whenGET('/posts/' + id + '/' + posts.commentsPerPage + '/' + page).respond(function () {
            called = true;
            return [200, {}, {}];
        })
        posts.get(id, page);
        expect(called).toEqual(false);
        httpBackend.flush();
        expect(called).toEqual(true);
    })

    describe('on voting', function () {
        var startVotes;
        var _id;
        var votable = {};
        var requestPath;
        beforeEach(function (){
            startVotes = 10;
            _id = "{1E4E91A3-BCA5-48B0-957F-6A9E5D0B546D}";
            votable = { upvotes: startVotes, _id: _id };
        })
        describe('for post', function () {
            describe('down', function () {
                beforeEach(function () {
                    votable.upvoted = true;
                    requestPath = '/posts/' + votable._id + '/downvote';
                })
                describe('on fail', function (){
                    it('should not allow downvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(400, {});
                        posts.downvote(votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes);
                        expect(votable.upvoted).toEqual(true);
                    })
                })
                describe('on success', function (){
                    it('should allow downvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(200, {});
                        posts.downvote(votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes - 1);
                        expect(votable.upvoted).toEqual(false);
                    })
                })
            })
            describe('up', function (){
                beforeEach(function () {
                    votable.upvoted = false;
                    requestPath = '/posts/' + votable._id + '/upvote';
                })
                describe('on fail', function () {
                    it('should not allow upvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(400, {});
                        posts.upvote(votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes);
                        expect(votable.upvoted).toEqual(false);
                    })
                })
                describe('on success', function () {
                    it('should not allow upvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(200, {});
                        posts.upvote(votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes + 1);
                        expect(votable.upvoted).toEqual(true);
                    })
                })
            })
        })
        
        describe('for comment', function () {
            var post = { _id: "{1F2D705C-A5A5-4F72-9AFF-E8F6230EF187}" };

            describe('down', function () {
                beforeEach(function () {
                    votable.upvoted = true;
                    requestPath = '/posts/' + post._id + '/comments/' + votable._id + '/downvote';
                })
                describe('on fail', function () {
                    it('should not allow downvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(400, {});
                        posts.downvoteComment(post ,votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes);
                        expect(votable.upvoted).toEqual(true);
                    })
                })
                describe('on success', function () {
                    it('should allow downvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(200, {});
                        posts.downvoteComment(post , votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes - 1);
                        expect(votable.upvoted).toEqual(false);
                    })
                })
            })
            describe('up', function () {
                beforeEach(function () {
                    votable.upvoted = false;
                    requestPath = '/posts/' + post._id + '/comments/' + votable._id + '/upvote';
                })
                describe('on fail', function () {
                    it('should not allow upvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(400, {});
                        posts.upvoteComment(post , votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes);
                        expect(votable.upvoted).toEqual(false);
                    })
                })
                describe('on success', function () {
                    it('should not allow upvoting', function () {
                        httpBackend.whenPUT(requestPath).respond(200, {});
                        posts.upvoteComment(post , votable);
                        httpBackend.flush();
                        expect(votable.upvotes).toEqual(startVotes + 1);
                        expect(votable.upvoted).toEqual(true);
                    })
                })
            })
        })
        
    })
})