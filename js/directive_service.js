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
			$scope.updateCompare = []

			if($scope.allservice.length > 0){
				//first we fill the compare for delete and inserts on locationupdate
				$scope.updateCompare = $scope.allservice;
			}

			$scope.clickServiceArrayAction = function(myservice) {
				myservice.isSelected = !myservice.isSelected
				if(myservice.isSelected) {
					$scope.selectedService.push(myservice);
				} else {
					$scope.selectedService.splice($scope.selectedService.indexOf(myservice), 1 );
				}			
			}
					
			$scope.allservice.services = $scope.selectedService;
			
			$scope.init = function() {
				if($scope.allservice.length > 0){
					//first we fill the compare for delete and inserts on locationupdate
					$scope.updateCompare = $scope.allservice;
				}
				$scope.selectAllServiceCategory();
				$scope.selectAllService();
			};

			//we have an update if array is filled with objects
			//comes in format
			//Object {"pid_locationservice":"64","fid_location":"67","fid_service":"73","pid_service":"73",
			//"fid_category":"1","servicename":"Groß","customergroup":"0","pid_servicecategory":"1","categoryname":"Brief"}
			//but we need
			//[{"pid_servicecategory":"1","categoryname":"Brief","pid_service":"69","fid_category":"1","servicename":"Standard","customergroup":"0","isSelected":true}]
			$scope.refreshService = function() {
				if($scope.updateCompare.length > 0){					
					//Now we activate the services selected
					for(var i=0; i < $scope.updateCompare.length; i++){
						for(var j=0; j < $scope.allService.length; j++){
							if($scope.updateCompare[i].pid_service == $scope.allService[j].pid_service){
								$scope.clickServiceArrayAction($scope.allService[j]);
							}			
						}			
					}
				}			
			}

												
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
			



			//DB-Object for this Controller - handles the requests for select, update and insert calls
			//It calls the DatabaseService and listen for a result.	
			$scope.dbService = function(queryoptions,querysettings) {
				var dbServicePromise = DatabaseService.query(querysettings.dbDataArray,querysettings);
					dbServicePromise.then(function(result) {
							switch(querysettings.dbDataCommand) {
								case "strSelectAllService":
									$scope.allService = result.data.data;
									$scope.refreshService();
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