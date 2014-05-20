mygmapApp.controller('locationmanagerNewLocation', ["$scope"
												  , "$rootScope"
												  , "$q"
												  ,"$http"
												  ,"DatabaseService"
												  ,"SharedService"
												  ,
												   function ($scope
												    	   , $rootScope
														   , $q
														   , $http
														   , DatabaseService
														   , SharedService
														   ) {
	//Settings for Brand
	$scope.myBrand = 'Kontrollzentrum - Location-Manager';
	SharedService.setBroadcastBrand($scope.myBrand);
	SharedService.setBroadcastObjectname('');
	
	//By-Reference-Objects for changeing Data with the Directives
	$scope.arrayAllContact = {contacts:[]};
	$scope.arrayAllService = {services:[]};
	$scope.arrayTimetableOpentime = {times:[]};
	$scope.arrayTimetableEmptytime = {times:[]};
	
	//Array of Objects for Radio-Buttons
	$scope.myLocationCategories = [	{'id': 0,
									 'name':'ServiceCenter'},
									{'id': 1,
									 'name':'ServicePoint'},
									{'id': 2,
									 'name':'Briefkasten'}];
	//Init Selection
	$scope.categorySelect = {"ServiceCenter":false,"ServicePoint":false,"Briefkasten":false};
	$scope.locationcategories = [];
		
	//InsertDataArray-Object for collecting user-inputs
	$scope.myInsertDataArray = {
        locationname: '',
        additiontoaddress: '',
		street: '',
		housenr: '',
		zipcode: '',
		locality: '',
		longitude: '',
		latitude: '',
		locationcategories: [],
		locationcontact: [],
		locationservice: [],
		locationopentime: [],
		locationemptytime: []
    };
	
	$scope.clickInsertLocation = function() {
		$scope.locationcategories = [];
		$scope.myInsertDataArray.locationservice = [];
		
		if($scope.categorySelect.ServiceCenter) {
			$scope.locationcategories.push(0);
		}
		if($scope.categorySelect.ServicePoint) {
			$scope.locationcategories.push(1);
		}
		if($scope.categorySelect.Briefkasten) {
			$scope.locationcategories.push(2);
		}	
		$scope.myInsertDataArray.locationcategories = $scope.locationcategories;
		$scope.myInsertDataArray.locationcontact = $scope.arrayAllContact.contacts;
		for(var i = 0; i <  $scope.arrayAllService.services.length; i++) {
			$scope.myInsertDataArray.locationservice.push($scope.arrayAllService.services[i].pid_service);
		}
		$scope.myInsertDataArray.locationopentime = $scope.arrayTimetableOpentime.times;
		$scope.myInsertDataArray.locationemptytime = $scope.arrayTimetableEmptytime.times;
		console.log($scope.myInsertDataArray);
		var querydata = $scope.myInsertDataArray;
		var querysettings = {
			dbDataCommand	: "strInsertLocation",
			dbDataArray		: angular.toJson(querydata)
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
					console.log(result.data.data);
					switch(querysettings.dbDataCommand) {
						case "strInsertLocation":
							if(result.data.data > 0) {
								$scope.alertaction = 'alert-success';
								$scope.showalert = true;
								$scope.alertstring = 'Der Datensatz wurde eingefügt (ID:' + result.data.data + ')';
							}
							if(!result.success) {
								$scope.alertaction = 'alert-danger';
								$scope.showalert = true;
								$scope.alertstring = 'Der Datensatz konnte nicht eingefügt werden';
							}
							break;
						case "strUpdateLocation":
							if(result.data.data == true) {
								$scope.alertaction = 'alert-success';
								$scope.showalert = true;
								$scope.alertstring = 'Der Datensatz wurde geändert!';
							}
							if(!result.success) {
								$scope.alertaction = 'alert-danger';
								$scope.showalert = true;
								$scope.alertstring = 'Der Datensatz konnte nicht geändert werden';
							}
							break;
						case "strDeleteLocation":
							if(result.data.data == true) {
								$scope.alertaction = 'alert-success';
								$scope.showalert = true;
								$scope.alertstring = 'Der Datensatz wurde gelöscht!';
							}
							if(!result.success) {
								$scope.alertaction = 'alert-danger';
								$scope.showalert = true;
								$scope.alertstring = 'Der Datensatz konnte nicht gelöscht werden';
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