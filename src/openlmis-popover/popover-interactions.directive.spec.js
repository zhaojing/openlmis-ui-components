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

describe('PopoverDirective', function() {

    var $scope, element, otherElement, popoverCtrl, jQuery, $timeout, $rootScope, $compile;

    beforeEach(function() {
        module('openlmis-popover');
        module('openlmis-templates');

        inject(function($injector) {
            jQuery = $injector.get('jQuery');
            $timeout = $injector.get('$timeout');
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        spyOn(jQuery.prototype, 'popover').and.callThrough();

        $scope = $rootScope.$new();

        $scope.popoverTitle = 'Popover Title';
        $scope.popoverClass = 'example-class';

        var html = '<div popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}">' +
                '... other stuff ....' +
            '</div>';
        element = $compile(html)($scope);

        angular.element('body').append(element);

        otherElement = angular.element('<button id="other" >Other</button>');
        angular.element('body').append(otherElement);

        popoverCtrl = element.controller('popover');
        spyOn(popoverCtrl, 'getElements').and.returnValue([angular.element('<p>Hello World!</p>')]);
        spyOn(popoverCtrl, 'open').and.callThrough();
        spyOn(popoverCtrl, 'close').and.callThrough();

        $scope.$apply();
    });

    it('opens when the element gets focus, and closes when blurred', function() {
        element.focus();
        $timeout.flush();

        expect(popoverCtrl.open).toHaveBeenCalled();

        otherElement.focus();
        $timeout.flush();

        expect(popoverCtrl.close).toHaveBeenCalled();
    });

    it('opens when the element is moused over, and closes when the mouse moves else where', function() {
        element.mouseover();
        $timeout.flush();

        expect(popoverCtrl.open).toHaveBeenCalled();

        element.mouseout();
        $timeout.flush();

        expect(popoverCtrl.close).toHaveBeenCalled();
    });

});
