// Controller for the launch page
angular.module('hydroDataAppModule').
controller('resChangeController', ['$scope', '$location', '$window', '$document', '$timeout', '$http', '$rootScope', 'passResChangeToEdit',  function($scope, $location, $window, $document, $timeout, $http, $rootScope, passResChangeToEdit) {
    $scope.units = {
        floraGro: $scope.editingFloraGroUnits || 'cups',
        floraBloom: $scope.editingFloraBloomUnits || 'cups',
        floraMicro: $scope.editingFloraMicroUnits || 'cups',
        calcium: $scope.editingCalciumUnits || 'mLs'
    }

    $scope.floraGro = {value: $scope.editingFloraGro || ''};
    $scope.floraBloom = {value: $scope.editingFloraBloom || ''};
    $scope.floraMicro = {value: $scope.editingFloraMicro || ''};
    $scope.calcium = {value: $scope.editingCalcium || ''};

    $scope.growthChart = [
        {
            growthType: 'Seedling',
            mlPerGalGro: 1,
            mlPerGalBloom: 1,
            mlPerGalMicro: 2,
            mlPerGalCalcium: 2
        },
        {
            growthType: 'Early Growth',
            mlPerGalGro: 5,
            mlPerGalBloom: 1,
            mlPerGalMicro: 4,
            mlPerGalCalcium: 5
        },
        {
            growthType: 'Late Growth',
            mlPerGalGro: 5,
            mlPerGalBloom: 2.5,
            mlPerGalMicro: 5,
            mlPerGalCalcium: 5
        },
        {
            growthType: 'Transition',
            mlPerGalGro: 4,
            mlPerGalBloom: 4,
            mlPerGalMicro: 4,
            mlPerGalCalcium: 5
        },
        {
            growthType: 'Early Bloom',
            mlPerGalGro: 1,
            mlPerGalBloom: 5,
            mlPerGalMicro: 4,
            mlPerGalCalcium: 5
        },
        {
            growthType: 'Mid Bloom',
            mlPerGalGro: 1,
            mlPerGalBloom: 6,
            mlPerGalMicro: 4,
            mlPerGalCalcium: 5
        },
        {
            growthType: 'Late Bloom',
            mlPerGalGro: 0,
            mlPerGalBloom: 8,
            mlPerGalMicro: 4,
            mlPerGalCalcium: 5
        },
        {
            growthType: 'Ripen',
            mlPerGalGro: 0,
            mlPerGalBloom: 8,
            mlPerGalMicro: 2.5,
            mlPerGalCalcium: 5
        }
    ];

    $scope.calculateNutes = function () {
        if ($scope.gallons === '' || typeof $scope.gallons === 'undefined') {
            return;
        }
        var mlPerGalGro, mlPerGalBloom, mlPerGalMicro, mlPerGalCalcium;
        $scope.growthChart.forEach(function (val, i, array) {
            if (val.growthType === $scope.selectedGrowthType) {
                mlPerGalGro = val.mlPerGalGro;
                mlPerGalBloom = val.mlPerGalBloom;
                mlPerGalMicro = val.mlPerGalMicro;
                mlPerGalCalcium = val.mlPerGalCalcium;
            }
        });
        $scope.floraGro.value = ($scope.gallons * mlPerGalGro) / 240;
        $scope.floraBloom.value = ($scope.gallons * mlPerGalBloom) / 240;
        $scope.floraMicro.value = ($scope.gallons * mlPerGalMicro) / 240;
        $scope.calcium.value = ($scope.gallons * mlPerGalCalcium);
    };

    $scope.convertToMLs = function (val, type) {
        val.value = parseFloat(val.value) * 240;
        $scope.units[type] = 'mLs';
    };

    $scope.convertToCups = function (val, type) {
        val.value = parseFloat(val.value) / 240;
        $scope.units[type] = 'cups';
    };

    $scope.submitData = function() {
        var data = {
            'date': new Date().toDateString(),
            'growthType' : $scope.selectedGrowthType,
            'gallons' : $scope.gallons,
            'ph' : $scope.ph,
            'tds' : $scope.tds,
            'floraGro' : $scope.floraGro.value,
            'floraBloom' : $scope.floraBloom.value,
            'floraMicro' : $scope.floraMicro.value,
            'calcium' : $scope.calcium.value,
            'units' : $scope.units
        };
        if (!$scope.isEditing) {
            $http.post('/resChange', data).success(function (data) {
    			if (data.msg !== 'success') {
                    alert("Error!");
                }
    		}).error (function (data) {
    			console.log(data);
    		});
        } else {
            $http.post('/resChangeUpdate/' + $scope.editId, data).success(function (data) {
                if (data.msg !== 'success') {
                    alert("Error!");
                }
                $scope.isEditing = false;
            }).error (function (data) {
                console.log(data);
            });
        }
    };

    $scope.changeView = function(view){
		$location.path(view); // path not hash
	}

    $scope.getLoc = function() {
		return $location.path();
	}

    $scope.$on('editing', function (event, args) {
        $scope.isEditing = true;
        var obj = passResChangeToEdit.getResChange();
        $scope.gallons = parseFloat(obj.gallons);
        $scope.ph = parseFloat(obj.ph);
        $scope.tds = parseFloat(obj.tds);
        $scope.selectedGrowthType = obj.growthType;
        $scope.editingFloraGroUnits = obj['units[floraGro]'];
        $scope.editingFloraMicroUnits = obj['units[floraMicro]'];
        $scope.editingFloraBloomUnits = obj['units[floraBloom]'];
        $scope.editingCalciumUnits = obj['units[calcium]'];
        $scope.editingFloraGro = parseFloat(obj.floraGro);
        $scope.editingFloraBloom = parseFloat(obj.floraBloom);
        $scope.editingFloraMicro = parseFloat(obj.floraMicro);
        $scope.editingCalcium = parseFloat(obj.calcium);
        $scope.editId = obj._id;
    });

    $scope.clearController = function () {
        if ($scope.isEditing) {
            $scope.changeView('viewData');
        } else {
            $scope.changeView('');
        }
        $scope.isEditing = false;
        $scope.gallons = '';
        $scope.ph = '';
        $scope.tds = '';
        $scope.selectedGrowthType = null;
        $scope.editingFloraGroUnits = null;
        $scope.editingFloraMicroUnits = null;
        $scope.editingFloraBloomUnits = null;
        $scope.editingCalciumUnits = null;
        $scope.editingFloraGro = null;
        $scope.editingFloraBloom = null;
        $scope.editingFloraMicro = null;
        $scope.editingCalcium = null;
        $scope.editId = null;
    }

}]);
