mygmapApp.controller('locationmanagerAllLocation', ["$scope"
												  , "$rootScope"
												  , "$q"
												  ,"$http"
												  ,"$filter"
												  ,"DatabaseService"
												  ,"SharedService"
												  ,
												   function ($scope
												    	   , $rootScope
														   , $q
														   , $http
														   , $filter
														   , DatabaseService
														   , SharedService
														   ) {
	//Settings for Brand
	$scope.myBrand = 'Kontrollzentrum - Location-Manager';
	SharedService.setBroadcastBrand($scope.myBrand);
	SharedService.setBroadcastObjectname('');
	
	$scope.init = function(){
		$scope.selectAllLocation();
		$scope.servicefilter = 1;
	}
	
	$scope.allLocation = null;

	$scope.selectAllLocation = function() {
		var querysettings = {
			dbDataCommand	: "strSelectAllLocation",
			dbDataArray		: null
		}
		
		var queryoptions = {
			beforefunctions	: null,
			afterfunctions	: null,
			objectsToClean	: null,
		}
		$scope.dbService(queryoptions,querysettings);	
	}
	
	$scope.hasCategory = function(fid_category,allcategories){
		return $filter('getLocationCategory')(fid_category,allcategories);
	}
	$scope.showModal = false;
	$scope.selectedLocation = null
	$scope.locationServiceCategories = null
	$scope.showLocationDetails = function(location){
		$scope.showModal = true;
		$scope.selectedLocation = location;
		$scope.filterLocationCategoryNames($scope.selectedLocation.services);
		//console.log($scope.selectedLocation.services);
	}
	
	$scope.locationServiceCategories = [];
	$scope.filterLocationCategoryNames = function(services){
		$scope.locationServiceCategories = [];
		for(var i=0; i<services.length; i++){
			if($scope.locationServiceCategories.length == 0){
				$scope.locationServiceCategories.push({'categoryname': services[i].categoryname, 'pid_servicecategory': services[i].pid_servicecategory});
			}
			var compare = services[i].categoryname;
			var found = false
			for(var j=0; j<$scope.locationServiceCategories.length; j++){
				if(compare == $scope.locationServiceCategories[j].categoryname){
					found = true;
				}
			}
			if(!found){
				$scope.locationServiceCategories.push({'categoryname': services[i].categoryname, 'pid_servicecategory': services[i].pid_servicecategory});
			}
		}
		$scope.myservicefilter = $scope.locationServiceCategories[0].pid_servicecategory;
	}
	
	$scope.clickSelectLocation = function(location) {
		SharedService.setSharedLocation(location);
		console.log(SharedService.sharedLocation);	
	}	
	//DB-Object for this Controller - handles the requests for select, update and insert calls
	//It calls the DatabaseService and listen for a result.	
	$scope.dbService = function(queryoptions,querysettings) {
		var dbServicePromise = DatabaseService.query(querysettings.dbDataArray,querysettings);
			dbServicePromise.then(function(result) {
					switch(querysettings.dbDataCommand) {
						case "strSelectAllLocation":
							$scope.allLocation = result.data.data;
							console.log(result.data.data);
							if(!result.success) {
								$scope.alertaction = 'alert-danger';
								$scope.showalert = true;
								$scope.alertstring = 'Datenbank-Error: Keine Erfolgreiche Abfrage';
							}
							break;
						default:
							break;
					} 
					if(queryoptions.afterfunctions != null) {
						angular.forEach(queryoptions.afterfunctions,function(value,index) {
							value();
						})						
					}
					if(queryoptions.objectsToClean != null) {
						angular.element('#serviceform').attr('novalidate',true);
						angular.forEach(queryoptions.objectsToClean,function(value,index) {
							$scope.objectCleaner(value);
						})					
					}
			}, function(error) {
				$scope.alertaction = 'alert-error';
				$scope.alertstring = 'Error: ' + error;
		});		
	}	

}]);