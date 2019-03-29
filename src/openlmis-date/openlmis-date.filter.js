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
     * @name openlmis-date.filter:openlmisDate
     *
     * @description
     * Returns date in given format. If no format provided, returns date in default format defined in config file.
     *
     * @param  {String} date        date to be formatted
     * @param  {String} dateFormat  (optional) format of the date
     * @param  {String} timezone    (optional) timezone with which to format (e.g. America/Los_Angeles)
     * @return {String}             formatted date
     */
    angular
        .module('openlmis-date')
        .filter('openlmisDate', openlmisDateFilter);

    openlmisDateFilter.$inject = ['$filter', 'localeService', 'moment'];

    function openlmisDateFilter($filter, localeService, moment) {
        return function(date, dateFormat, timezone) {
            if (!dateFormat) {
                dateFormat = localeService.getFromStorage().dateFormat;
            }

            if (!timezone) {
                timezone = moment.tz(date, localeService.getFromStorage().timeZoneId).format('Z');
            }

            return $filter('date')(date, dateFormat, timezone);
        };
    }

})();
