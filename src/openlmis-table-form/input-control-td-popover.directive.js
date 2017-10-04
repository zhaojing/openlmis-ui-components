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
     * @ngdoc directive
     * @restrict A
     * @name openlmis-table-form.directive:inputControlTdPopover
     *
     * @description
     * Displays the openlmis-invalid message in a popover.
     */
    
    angular
        .module('openlmis-table-form')
        .directive('inputControl', directive);
    
    function directive() {
        return {
            restrict: 'A',
            priority: 4, // before input-control.directive.js
            link: link
        };
    }

    function link(scope, element, attrs) {
        var openlmisPopoverCtrl = element.controller('popover');

        if(openlmisPopoverCtrl) {
            element.on('openlmisInvalid.show', showMessage);
            element.on('openlmisInvalid.hide', hideMessage);

            openlmisPopoverCtrl.updateTabIndex = updateTabIndex;
        }

        function updateTabIndex() {
            element.attr('tabindex', -1);
        }

        function showMessage(event, messageElement) {
            event.preventDefault();

            // default placement is 10, this is higher than most elements
            openlmisPopoverCtrl.addElement(messageElement, 5);
        }

        function hideMessage(event, messageElement) {
            openlmisPopoverCtrl.removeElement(messageElement);
        }
    }

})();