/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-modal.stateInterceptorListeners
     *
     * @description
     * Closes modal when state is not found or changed with success/error.
     */
    angular.module('openlmis-modal')
        .run(stateInterceptorListeners);

    stateInterceptorListeners.$inject = ['$rootScope', 'loadingModalService'];
    function stateInterceptorListeners($rootScope, loadingModalService) {
        $rootScope.$on('$stateChangeStart', function() {
            console.log('start');
            loadingModalService.open(true);
        });
        $rootScope.$on('$stateChangeSuccess', onSuccess);
        $rootScope.$on('$stateChangeError', onError);
        $rootScope.$on('$stateNotFound', notFound);

        function onSuccess() {
            console.log('success');
            loadingModalService.close();
        }

        function onError() {
            console.log('error');
            loadingModalService.close();
        }

        function notFound() {
            console.log('not found');
            loadingModalService.close();
        }
    }

})();
