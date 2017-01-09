(function() {

    'use strict';

    angular
        .module('requisition-losses-and-adjustments')
        .controller('LossesAndAdjustmentsCtrl', lossesAndAdjustmentsCtrl);

    lossesAndAdjustmentsCtrl.$inject = ['$scope', '$filter', 'calculations'];

    function lossesAndAdjustmentsCtrl($scope, $filter, calculations) {
        var vm = this;

        vm.lineItem = $scope.lineItem;
        vm.requisition = $scope.requisition;
        vm.adjustments = vm.lineItem.stockAdjustments;
        vm.reasons = vm.requisition.$stockAdjustmentReasons;

        vm.addAdjustment = addAdjustment;
        vm.removeAdjustment = removeAdjustment;
        vm.getReasonName = getReasonName;
        vm.getTotal = getTotal;

        function addAdjustment() {
            vm.adjustments.push({
                reasonId: vm.adjustment.reason.id,
                quantity: vm.adjustment.quantity
            });
            vm.adjustment.quantity = undefined;
            vm.adjustment.reason = undefined;
            vm.lineItem.totalLossesAndAdjustments = vm.getTotal();
        }

        function removeAdjustment(adjustment) {
            var index = vm.adjustments.indexOf(adjustment);
            vm.adjustments.splice(index, 1);
            vm.lineItem.totalLossesAndAdjustments = vm.getTotal();
        }

        function getReasonName(reasonId) {
            var reason = $filter('filter')(vm.reasons, {
                id: reasonId}, true
            );

            if (reason && reason.length) {
                return reason[0].name;
            }
        }

        function getTotal() {
            return calculations.totalLossesAndAdjustments(vm.lineItem, vm.reasons);
        }
    }

})();