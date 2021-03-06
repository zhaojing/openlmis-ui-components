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
describe('stateTrackerInterceptor', function() {

    beforeEach(function() {
        module('openlmis-state-tracker', function($stateProvider) {
            $stateProvider.state('stateOne', {
                url: '/stateOne?param'
            });
            $stateProvider.state('stateTwo', {});
        });

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.stateTrackerService = $injector.get('stateTrackerService');
        });
    });

    it('should store the previous state if state has changed', function() {
        this.$state.go('stateOne', {
            param: 'someParam'
        });
        this.$rootScope.$apply();

        spyOn(this.stateTrackerService, 'setPreviousState');

        this.$state.go('stateTwo', {
            param: 'someParam'
        });
        this.$rootScope.$apply();

        expect(this.stateTrackerService.setPreviousState).toHaveBeenCalledWith({
            url: '/stateOne?param',
            name: 'stateOne'
        }, {
            param: 'someParam'
        });
    });

    it('should not store state if only parameters changed', function() {
        this.$state.go('stateOne');
        this.$rootScope.$apply();

        spyOn(this.stateTrackerService, 'setPreviousState');

        this.$state.go('stateOne', {
            param: 'some'
        });
        this.$rootScope.$apply();

        expect(this.stateTrackerService.setPreviousState).not.toHaveBeenCalled();
    });

});
