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
   * @ngdoc filter
   * @name openlmis-percentage.filter:percentage
   *
   * @description
   * Filter for converting number into percentage format.
   *
   * @param  {Number}  number   the number to be formatted
   * @param  {Integer} decimals number of digits in fraction. Default value is 0.
   * @return {String}           number in percentage formatted string
   */
    angular
        .module('openlmis-percentage')
        .filter('percentage', filter);

    filter.$inject = ['$filter'];

    function filter($filter) {
        return function(number, decimals) {
            return $filter('number')(number * 100, decimals || 0) + '%';
        };
    }
})();
