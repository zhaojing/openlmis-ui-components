(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition.RequisitionFactory
     *
     * @description
     * Responsible for supplying requisition with additional methods.
     */
    angular
        .module('requisition')
        .factory('RequisitionFactory', requisitionFactory);

    requisitionFactory.$inject = ['$q', '$resource', 'openlmisUrlFactory', 'requisitionUrlFactory',
        'RequisitionTemplate', 'LineItem', 'categoryFactory', 'Status', 'Source',
        'localStorageFactory', 'offlineService'
    ];

    function requisitionFactory($q, $resource, openlmisUrlFactory, requisitionUrlFactory, RequisitionTemplate,
        LineItem, categoryFactory, Status, Source, localStorageFactory, offlineService) {

        var offlineRequitions = localStorageFactory('requisitions'),
            offlineStockAdjustmentReasons = localStorageFactory('stockAdjustmentReasons');

        var resource = $resource(requisitionUrlFactory('/api/requisitions/:id'), {}, {
            'authorize': {
                url: requisitionUrlFactory('/api/requisitions/:id/authorize'),
                method: 'POST'
            },
            'save': {
                method: 'PUT',
                transformRequest: transformRequisition
            },
            'submit': {
                url: requisitionUrlFactory('/api/requisitions/:id/submit'),
                method: 'POST'
            },
            'approve': {
                url: requisitionUrlFactory('/api/requisitions/:id/approve'),
                method: 'POST'
            },
            'reject': {
                url: requisitionUrlFactory('/api/requisitions/:id/reject'),
                method: 'PUT'
            },
            'skip': {
                url: requisitionUrlFactory('/api/requisitions/:id/skip'),
                method: 'PUT'
            }
        });

        return requisition;

        /**
         * @ngdoc function
         * @name requisition
         * @methodOf requisition.RequisitionFactory
         * @param {Resource} requisition resource with requisition
         * @param {Resource} template resource with requisition template
         * @param {Resource} approvedProducts resource with approved products
         * @return {Object} requisition with methods
         *
         * @description
         * Adds all needed methods and information from template to given requisition.
         *
         */
        function requisition(requisition, template, approvedProducts, reasons) {
            var programId = requisition.program.id;

            requisition.$authorize = authorize;
            requisition.$save = save;
            requisition.$submit = submit;
            requisition.$remove = remove;
            requisition.$approve = approve;
            requisition.$reject = reject;
            requisition.$skip = skip;
            requisition.$isInitiated = isInitiated;
            requisition.$isSubmitted = isSubmitted;
            requisition.$isApproved = isApproved;
            requisition.$isAuthorized = isAuthorized;
            requisition.$template = new RequisitionTemplate(template, requisition);
            requisition.$stockAdjustmentReasons = reasons;

            var lineItems = [];
            requisition.requisitionLineItems.forEach(function(lineItem) {
                lineItems.push(new LineItem(lineItem, requisition));
            });
            requisition.requisitionLineItems = lineItems;

            requisition.$fullSupplyCategories = categoryFactory.groupFullSupplyLineItems(lineItems, programId);
            requisition.$nonFullSupplyCategories = categoryFactory.groupNonFullSupplyLineItems(lineItems, programId);
            requisition.$approvedCategories = categoryFactory.groupProducts(lineItems, approvedProducts);
            return requisition;
        }

        /**
         * @ngdoc function
         * @name authorize
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} requisition promise
         *
         * @description
         * Authorizes requisition.
         *
         */
        function authorize() {
            var requisition = this;
            return handlePromise(resource.authorize({
                id: this.id
            }, {}).$promise, function(authorized) {
                saveToStorage(authorized, requisition.$availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name remove
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} promise that resolves after requisition is deleted
         *
         * @description
         * Removes requisition.
         *
         */
        function remove() {
            var id = this.id;
            return handlePromise(resource.remove({
                id: this.id
            }).$promise, function() {
                offlineRequitions.removeBy('id', id);
            });
        }

        /**
         * @ngdoc function
         * @name save
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} requisition promise
         *
         * @description
         * Saves requisition.
         *
         */
        function save() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.save({
                id: this.id
            }, this).$promise, function(saved) {
                saveToStorage(saved, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name submit
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} requisition promise
         *
         * @description
         * Submits requisition.
         *
         */
        function submit() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.submit({
                id: this.id
            }, {}).$promise, function(submitted) {
                saveToStorage(submitted, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name approve
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} promise that resolves when requisition is approved
         *
         * @description
         * Approves requisition.
         *
         */
        function approve() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.approve({
                id: this.id
            }, {}).$promise, function(approved) {
                saveToStorage(approved, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name reject
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} promise that resolves when requisition is rejected
         *
         * @description
         * Rejects requisition.
         *
         */
        function reject() {
            var availableOffline = this.$availableOffline;
            return handlePromise(resource.reject({
                id: this.id
            }, {}).$promise, function(rejected) {
                saveToStorage(rejected, availableOffline);
            });
        }

        /**
         * @ngdoc function
         * @name skip
         * @methodOf requisition.RequisitionFactory
         * @return {Promise} promise that resolves when requisition is skipped
         *
         * @description
         * Skips requisition.
         *
         */
        function skip() {
            return handlePromise(resource.skip({
                id: this.id
            }, {}).$promise, function(requisition) {
                offlineRequitions.removeBy('id', requisition.id);
            });
        }

        /**
         * @ngdoc function
         * @name isInitiated
         * @methodOf requisition.RequisitionFactory
         *
         * @description
         * Responsible for checking if requisition is initiated.
         * Returns true only if requisition status equals initiated.
         *
         * @return {boolean} is requisition initiated
         */
        function isInitiated() {
            return this.status === Status.INITIATED;
        }

        /**
         * @ngdoc function
         * @name isSubmitted
         * @methodOf requisition.RequisitionFactory
         *
         * @description
         * Responsible for checking if requisition is submitted.
         * Returns true only if requisition status equals submitted.
         *
         * @return {boolean} is requisition submitted
         */
        function isSubmitted() {
            return this.status === Status.SUBMITTED;
        }

        /**
         * @ngdoc function
         * @name isAuthorized
         * @methodOf requisition.RequisitionFactory
         *
         * @description
         * Responsible for checking if requisition is authorized.
         * Returns true only if requisition status equals authorized.
         *
         * @return {boolean} is requisition authorized
         */
        function isAuthorized() {
            return this.status === Status.AUTHORIZED;
        }

        /**
         * @ngdoc function
         * @name isApproved
         * @methodOf requisition.RequisitionFactory
         *
         * @description
         * Responsible for checking if requisition is approved.
         * Returns true only if requisition status equals approved.
         *
         * @return {boolean} is requisition approved
         */
        function isApproved() {
            return this.status === Status.APPROVED;
        }

        function handlePromise(promise, success, failure) {
            var deferred = $q.defer();

            promise.then(function(response) {
                if (success) success(response);
                deferred.resolve(response);
            }, function() {
                if (failure) failure();
                deferred.reject();
            });

            return deferred.promise;
        }

        function saveToStorage(requisition, shouldSave) {
            if (shouldSave) {
                requisition.$modified = false;
                offlineRequitions.put(requisition);
            }
        }

        function transformRequisition(requisition) {
            var columns = requisition.$template.columns;
            angular.forEach(requisition.requisitionLineItems, function(lineItem) {
                transformLineItem(lineItem, columns);
            });
            requisition.$nonFullSupplyCategories.forEach(function(category) {
                category.lineItems.forEach(function(lineItem) {
                    if (requisition.requisitionLineItems.indexOf(lineItem) === -1) {
                        requisition.requisitionLineItems.push(lineItem);
                    }
                });
            });
            return angular.toJson(requisition);
        }


        function transformLineItem(lineItem, columns) {
            angular.forEach(columns, function(column) {
                if (!column.display || column.source === Source.CALCULATED) {
                    lineItem[column.name] = null;
                }
            });
        }
    }

})();
