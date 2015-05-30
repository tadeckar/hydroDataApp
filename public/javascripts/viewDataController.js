angular.module('hydroDataAppModule').
controller('viewDataController', ['$scope', '$location', '$window', '$document', '$timeout', '$http', '$rootScope', 'passResChangeToEdit',  function($scope, $location, $window, $document, $timeout, $http, $rootScope, passResChangeToEdit) {

    $scope.getData = function () {
        $http.get('/getData').success(function (data) {
            $scope.resChangeData = data;
        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.editResChange = function(i){
        passResChangeToEdit.setResChange(i);
		$location.path('resChange');
        $rootScope.$broadcast('editing', {});
	}


}]);
