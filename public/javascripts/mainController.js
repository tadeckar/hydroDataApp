// Controller for the launch page
angular.module('hydroDataAppModule').
controller('mainController', ['$scope', '$location', '$window', '$document', '$timeout', '$http', '$rootScope',  function($scope, $location, $window, $document, $timeout, $http, $rootScope) {

    $scope.changeView = function(view){
		$location.path(view); // path not hash
	}

	$scope.getLoc = function() {
		return $location.path();
	}

    $scope.submitData = function() {
        var data = {
            'date': new Date().toDateString(),
            'ph' : $scope.ph,
            'tds' : $scope.tds,
            'floraGro' : $scope.floraGro,
            'floraBloom' : $scope.floraBloom,
            'floraMicro' : $scope.floraMicro,
            'calcium' : $scope.calcium
        };
        $http.post('/resChange', data).success(function (data) {
			if (data.msg !== 'success') {
                console.log(data.msg);
            }
		}).error (function (data) {
			console.log(data);
		});
    }

    $scope.getData = function () {
        $http.get('/getData').success(function (data) {
            $scope.resChangeData = data;
        }).error(function (data) {
            console.log(data);
        });
    }

}]);
