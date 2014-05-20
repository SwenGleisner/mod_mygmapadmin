'use strict';

/* Controllers */
var mygmapApp = angular.module('mygmapApp.controllers', []);

mygmapApp.controller('initController', ["$scope", "$http", "SharedService", function ($scope, $http, SharedService) {
	$scope.myBrand = 'Kontrollzentrum';
	$scope.myObjectname = '';
	
	jQuery(document).ready(function() {
		jQuery(".module-title").hide();
		jQuery(".logo").hide();
	});

    $scope.$on('handleBroadcast', function() {
        $scope.myBrand = SharedService.brand;
		$scope.myObjectname = SharedService.objectname;
    });		
}]).$inject = ['$scope', 'SharedService'];

mygmapApp.controller('landingController', ["$scope", "SharedService", function ($scope, SharedService) {
	$scope.myCategoryObjectsArr = [] ;
	$scope.myBrand = 'Kontrollzentrum - Startseite';
	$scope.setActualCategory = function(pid,objectname) {
		SharedService.setBroadcastPID(pid,objectname);
    };
	SharedService.setBroadcastBrand($scope.myBrand);
	SharedService.setBroadcastObjectname('');
         
}]).$inject = ['$scope', 'SharedService'];


mygmapApp.controller('locationmanagerShowDirectory', ["$scope", "$http","LocationService","SharedService", function ($scope, $http, LocationService, SharedService) {
	$scope.myBrand = 'Kontrollzentrum - Location-Manager';
	SharedService.setBroadcastBrand($scope.myBrand);
	SharedService.setBroadcastObjectname('Location-Directory');
}]);

