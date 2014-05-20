mygmapAppDirectives.directive("service" , function() {
    return {
        restrict: 'E',
		scope: { 
			allservice: '='
		},
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_service.html',
		controller: function($scope,DatabaseService) {
			$scope.customergroup = 0;
			$scope.serviceCategorys = null;
			$scope.allService = null;
			$scope.selectedService = [];
			
			$scope.allservice.services = $scope.selectedService;
			
			$scope.init = function () {
				$scope.selectAllServiceCategory();
				$scope.selectAllService();
			};
									
			$scope.selectAllServiceCategory = function() {
				var querysettings = {
					dbDataCommand	: "strSelectAllServiceCategory",
					dbDataArray		: null
				}
				
				var queryoptions = {
					beforefunctions	: null,
					afterfunctions	: null,
					objectsToClean	: null,
				}
				$scope.dbService(queryoptions,querysettings);	
			}

			$scope.selectAllService = function(){
				var querysettings = {
					dbDataCommand	: "strSelectAllService",
					dbDataArray		: null
				}
				
				var queryoptions = {
					beforefunctions	: null,
					afterfunctions	: null,
					objectsToClean	: null,
				}
				$scope.dbService(queryoptions,querysettings);
			}
			
			$scope.clickServiceArrayAction = function(myservice) {
				myservice.isSelected = !myservice.isSelected
				if(myservice.isSelected) {
					$scope.selectedService.push(myservice);
				} else {
					$scope.selectedService.splice($scope.selectedService.indexOf(myservice), 1 );
				}			
			}


			//DB-Object for this Controller - handles the requests for select, update and insert calls
			//It calls the DatabaseService and listen for a result.	
			$scope.dbService = function(queryoptions,querysettings) {
				var dbServicePromise = DatabaseService.query(querysettings.dbDataArray,querysettings);
					dbServicePromise.then(function(result) {
							switch(querysettings.dbDataCommand) {
								case "strSelectAllService":
									$scope.allService = result.data.data;
									break;
								case "strSelectAllServiceCategory":
									$scope.serviceCategorys = result.data.data;
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
		}
	};
});