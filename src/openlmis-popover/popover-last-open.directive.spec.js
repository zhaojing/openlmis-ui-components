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
    var $scope, element, popoverCtrl, jQuery, otherElement, otherPopoverCtrl, $compile, $rootScope;

    beforeEach(function() {
        module('openlmis-popover');
        module('openlmis-templates');

        inject(function($injector) {
            jQuery = $injector.get('jQuery');
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        spyOn(jQuery.prototype, 'popover').andCallThrough();

        $scope = $rootScope.$new();

        $scope.popoverTitle = 'Popover Title';
        $scope.popoverClass = 'example-class';

        var html = '<div popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}" >' +
                '... other stuff ....' +
            '</div>';
        element = $compile(html)($scope);
        angular.element('body').append(element);

        var otherHtml = '<div popover>Something...</div>';
        otherElement = $compile(otherHtml)($scope);
        angular.element('body').append(otherElement);

        popoverCtrl = element.controller('popover');
        spyOn(popoverCtrl, 'getElements').andReturn([angular.element('<p>Hello World!</p>')]);

        otherPopoverCtrl = otherElement.controller('popover');
        spyOn(otherPopoverCtrl, 'getElements').andReturn([angular.element('<p>Example</p>')]);

        $scope.$apply();
    });

    it('closes one popover, when the other opens', function() {
        spyOn(popoverCtrl, 'close').andCallThrough();

        popoverCtrl.open();
        otherPopoverCtrl.open();

        expect(popoverCtrl.close).toHaveBeenCalled();
    });

});
