angular.module('flapperNews').factory('users', ['$http', '$rootScope', function ($http, $rootScope) {
        var ob = {};
        
        var saveUserFromResponse = function (data) {
            if (data.data && data.data.username) {
                ob.user = data.data;
                //tell navBar directive that username has changed.
                $rootScope.$broadcast('user:updated', ob.user);
                return true;
            }
            return false;
        };
        var clearUser = function () {
            ob.user = undefined;
            //tell navBar directive that username has changed.
            $rootScope.$broadcast('user:updated');
        }
        ob.isAuthorized = function () {
            if (ob.user && ob.user.rights === 'admin') return true;
            return false;
        }
        ob.authenticate = function (username, password) {
            return $http.post('/login', {
                username : username, 
                password : password
            }).then(saveUserFromResponse);
        };
        ob.signup = function (username, password, firstName, lastName, email) {
            return $http.post('/account', {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email
            }).then(saveUserFromResponse);
        }
        ob.logOut = function () {
            return $http.get('/logout').then(function () {
                clearUser();
            });
        }
        ob.fetchUser = function () {
            return $http.get('/account')
            .then(saveUserFromResponse);
        }
        ob.changePass = function (current, requested) {
            return $http.put('/password', { current: current, requested: requested })
            .then(function (data) {
                return data.data;
            });
        }
        ob.edit = function (firstName, lastName, email) {
            return $http.put('/account', {
                firstName: firstName,
                lastName: lastName,
                email: email
            }).then(saveUserFromResponse);
        }
        return ob;
    }]);