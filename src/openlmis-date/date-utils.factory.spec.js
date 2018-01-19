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

describe('dateUtils', function() {

    var dateUtils;

    beforeEach(function() {
        module('openlmis-date');

        inject(function($injector) {
            dateUtils = $injector.get('dateUtils');
        });
    });

    describe('addDaysToDate', function() {

        it('should add days', function() {
            var date = dateUtils.addDaysToDate(new Date('2017-05-10'), 2);
            expect(date).toEqual(new Date('2017-05-12'));
        });
    });

    describe('toDate', function() {

        it('should create date from iso string', function() {
            var date = new Date('2017-05-12');
            expect(dateUtils.toDate(date.toISOString())).toEqual(date);
        });

        it('should create date from array with 3 elements', function() {
            var date = new Date('2017-05-12');
            expect(dateUtils.toDate([2017, 5, 12])).toEqual(date);
        });

        it('should create date from array with 6 elements', function() {
            var date = new Date('2017-01-31T10:12:14Z');
            expect(dateUtils.toDate([2017, 1, 31, 10, 12, 14])).toEqual(date);
        });
    });

    describe('toArray', function() {

        it('should convert to date without time', function() {
            var date = new Date('2017-05-10');
            expect(dateUtils.toArray(date, false)).toEqual([2017, 5, 10]);
        });

        it('should convert to date with time', function() {
            var date = new Date('2017-05-08T10:12:14Z');
            expect(dateUtils.toArray(date, true)).toEqual([2017, 5, 8, 10, 12, 14]);
        });
    });

    describe('toStringDate', function() {

        it('should add days', function() {
            expect(dateUtils.toStringDate(new Date('2017-05-12'))).toEqual('2017-05-12');
        });
    });
});
