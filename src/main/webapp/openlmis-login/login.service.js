(function(){
    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-login.LoginService
     *
     * @description
     * Facilitates the login process between the OpenLMIS Server and the UI client.
     * This service works with the authorizationService, which is responsible for storing implementation details.
     */
    angular
        .module('openlmis-login')
        .service('LoginService', LoginService);

    LoginService.$inject = ['$rootScope', '$q', '$http', 'authUrl', 'OpenlmisURL', 'authorizationService',
                            'Right', '$state'];

    function LoginService($rootScope, $q, $http, authUrl, OpenlmisURL, authorizationService, Right, $state) {

        this.login = login;
        this.logout = logout;
        this.forgotPassword = forgotPassword;
        this.changePassword = changePassword;

        function makeAuthorizationHeader(clientId, clientSecret){
            var data = btoa(clientId + ':' + clientSecret);
            return 'Basic ' + data;
        }

        function getAuthorizationHeader(){
            var deferred = $q.defer();
            $http.get('credentials/auth_server_client.json')
            .then(function(response){
                var header = makeAuthorizationHeader(
                    response.data['auth.server.clientId'],
                    response.data['auth.server.clientSecret']
                );
                deferred.resolve(header);
            }).catch(function(){
                deferred.reject();
            });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name login
         * @methodOf openlmis-login.LoginService
         *
         * @description
         * Makes an HTTP request to login the user.
         *
         * This method returns a function that will return a promise with no value.
         *
         * @param {String} username The name of the person trying to login
         * @param {String} password The password the person is trying to login with
         */
        function login(username, password){
            var deferred = $q.defer();
            var promise = getAuthorizationHeader()
            .then(function(AuthHeader) {
                $http({
                    method: 'POST',
                    url: authUrl('/api/oauth/token?grant_type=password'),
                    data: 'username=' + username + '&password=' + password,
                    headers: {
                        'Authorization': AuthHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    authorizationService.setAccessToken(response.data.access_token);
                    getUserInfo(response.data.referenceDataUserId).then(function() {
                        getUserRights(response.data.referenceDataUserId).then(function() {
                            if ($state.is('auth.login')) {
                                $rootScope.$emit('auth.login');
                            } else {
                                $rootScope.$emit('auth.login-modal');
                            }
                            deferred.resolve();
                        }, function(){
                            authorizationService.clearAccessToken();
                            deferred.reject();
                        });
                    }, function(){
                        authorizationService.clearAccessToken();
                        deferred.reject();
                    });
                }, function() { // catch HTTP error
                    deferred.reject();
                });
            }, function(){
                deferred.reject();
            });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name logout
         * @methodOf openlmis-login.LoginService
         *
         * @description
         * Calls the server, and removes from authorization service.
         */
        function logout(){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: authUrl('/api/users/logout')
            }).then(function() {

                authorizationService.clearAccessToken();
                authorizationService.clearUser();
                authorizationService.clearRights();

                deferred.resolve();
            }).catch(function(){
                deferred.reject();
            });
            return deferred.promise;
        }

        function getUserInfo(userId){
            var deferred = $q.defer();
            if(!authorizationService.isAuthenticated()) {
                deferred.reject();
            } else {
                var userInfoURL = authUrl(
                    '/api/users/' + userId
                );
                $http({
                    method: 'GET',
                    url: userInfoURL,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    authorizationService.setUser(userId, response.data.username);
                    //getUserRights(userId);
                    deferred.resolve();
                }).catch(function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        function getUserRights(userId) {
            var deferred = $q.defer();

            if(!authorizationService.isAuthenticated()) {
                deferred.reject();
            } else {
                var userRoleAssignmentsURL = OpenlmisURL(
                    '/api/users/' + userId + '/roleAssignments'
                );
                $http({
                    method: 'GET',
                    url: userRoleAssignmentsURL,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {
                    authorizationService.setRights(Right.buildRights(response.data));
                    deferred.resolve();
                }).catch(function() {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name forgotPassword
         * @methodOf openlmis-login.LoginService
         *
         * @description
         * Calls the server that sends message with reset password link to given email address.
         *
         * @param {String} email Mail address where reset password link will be sent
         * @returns {Promise} Forgot password promise
         */
        function forgotPassword(email) {
            var forgotPasswordURL = OpenlmisURL('/api/users/forgotPassword?email=' + email);

            return $http({
                method: 'POST',
                url: forgotPasswordURL,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        /**
         * @ngdoc function
         * @name changePassword
         * @methodOf openlmis-login.LoginService
         *
         * @description
         * Calls the server that changes user account password.
         *
         * @param {String} newPassword New password for user account
         * @param {String} token Token that identifies user
         * @returns {Promise} Resolves when password is changed successfully.
         */
        function changePassword(newPassword, token) {
            var changePasswordURL = OpenlmisURL('/api/users/changePassword'),
                data = {
                    token: token,
                    newPassword: newPassword
                };

            if(authorizationService.isAuthenticated()) authorizationService.clearAccessToken();

            return $http({
                method: 'POST',
                url: changePasswordURL,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });;
        }
    }

})();