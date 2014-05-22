mygmapApp.controller('locationmanagerNewLocation', ["$scope"
												  , "$rootScope"
												  , "$q"
												  ,"$http"
												  ,"DatabaseService"
												  ,"ObjectValueCompare"
												  ,"LocationUpdateFilterService"
												  ,"ObjectValueCompare"
												  ,"SharedService"
												  ,
												   function ($scope
												    	   , $rootScope
														   , $q
														   , $http
														   , DatabaseService
														   , ObjectValueCompare
														   , LocationUpdateFilterService
														   , ObjectValueCompare
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
	
	$scope.objectToUpdate = null;
	$scope.objectToCompare = null;
	$scope.myCompareDataArray = null;
	$scope.update = false;
	//If there are Objects, we have an update and must prepare	
	if(SharedService.sharedLocation.length != '') {
		$scope.update = true;
		//First we make a deep copy
		$scope.objectToUpdate = angular.copy(SharedService.sharedLocation);
		$scope.objectToCompare = angular.copy(SharedService.sharedLocation);
		//we hide the insert Button of the form
			
		//Extract the Categories
		for(var i = 0; i < $scope.objectToUpdate.categories.length; i++){
			if($scope.objectToUpdate.categories[i].fid_category == 0) {
				$scope.categorySelect.ServiceCenter = true;
				$scope.locationcategories.push(0);
			}
			if($scope.objectToUpdate.categories[i].fid_category == 1) {
				$scope.categorySelect.ServicePoint = true;
				$scope.locationcategories.push(1);
			}
			if($scope.objectToUpdate.categories[i].fid_category == 2) {
				$scope.categorySelect.Briefkasten = true;
				$scope.locationcategories.push(2);
			}	
		}
		//Fill the insertDataArray with what we have
		$scope.myInsertDataArray = {
			locationname: $scope.objectToUpdate.locationname,
			additiontoaddress: $scope.objectToUpdate.additiontoaddress,
			street: $scope.objectToUpdate.street,
			housenr: $scope.objectToUpdate.housenr,
			zipcode: $scope.objectToUpdate.zipcode,
			locality: $scope.objectToUpdate.locality,
			longitude: $scope.objectToUpdate.longitude,
			latitude: $scope.objectToUpdate.latitude,
			locationcategories: [],
			locationcontact: [],
			locationservice: [],
			locationopentime: [],
			locationemptytime: []
		};	
		//Make a compareDataArray
		$scope.myCompareDataArray = angular.copy($scope.myInsertDataArray);
		
		$scope.arrayAllService = $scope.objectToUpdate.services;
		$scope.arrayAllContact.contacts = $scope.objectToUpdate.contacts;
		$scope.arrayTimetableEmptytime = $scope.objectToUpdate.emptytimes;
		$scope.arrayTimetableOpentime = $scope.objectToUpdate.opentimes;
	}
		
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
		$scope.myInsertDataArray.locationopentime = angular.copy($scope.arrayTimetableOpentime.times);
		for(var i = 0; i <  $scope.myInsertDataArray.locationopentime.length; i++) {
			$scope.myInsertDataArray.locationopentime[i].day = $scope.myInsertDataArray.locationopentime[i].day.id;
		}
		$scope.myInsertDataArray.locationemptytime = angular.copy($scope.arrayTimetableEmptytime.times);
		for(var i = 0; i <  $scope.myInsertDataArray.locationemptytime.length; i++) {
			$scope.myInsertDataArray.locationemptytime[i].day = $scope.myInsertDataArray.locationemptytime[i].day.id;
		}

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

	$scope.clickUpdateLocation = function() {
		//Prepare Form-Data for compare
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
		$scope.myInsertDataArray.locationopentime = angular.copy($scope.arrayTimetableOpentime.times);
		for(var i = 0; i <  $scope.myInsertDataArray.locationopentime.length; i++) {
			$scope.myInsertDataArray.locationopentime[i].day = $scope.myInsertDataArray.locationopentime[i].day.id;
		}
		$scope.myInsertDataArray.locationemptytime = angular.copy($scope.arrayTimetableEmptytime.times);
		for(var i = 0; i <  $scope.myInsertDataArray.locationemptytime.length; i++) {
			$scope.myInsertDataArray.locationemptytime[i].day = $scope.myInsertDataArray.locationemptytime[i].day.id;
		}
		
		//Now all Data from Form is prepared for compare with old Data for inserts,deletes and updates 
		var resultservices = LocationUpdateFilterService.compare($scope.objectToCompare.services,$scope.myInsertDataArray.locationservice,'fid_service','fid_service');
		//console.log('######## RESULT Services');
		//console.log(resultservices);
		//console.log('########');
		var resultcontacs = LocationUpdateFilterService.compare($scope.objectToCompare.contacts,$scope.myInsertDataArray.locationcontact,'pid_contact','pid_contact');
		//console.log('######## RESULT Contacts');
		//console.log(resultcontacs);
		var resultemptytimes = LocationUpdateFilterService.compare($scope.objectToCompare.emptytimes,$scope.myInsertDataArray.locationemptytime,'pid_time','pid_opentime');
		//console.log('######## Emptytimes');
		//console.log(resultemptytimes);
		var resultopentimes = LocationUpdateFilterService.compare($scope.objectToCompare.opentimes,$scope.myInsertDataArray.locationopentime,'pid_time','pid_opentime');
		//console.log('######## Opentimes');
		//console.log(resultopentimes);
		
		//Make a copy to compare Addressdata and empty the arrays
		$scope.actualAddressData = angular.copy($scope.myInsertDataArray);
		$scope.actualAddressData.locationcategories = [];
		$scope.actualAddressData.locationcontact = [];
		$scope.actualAddressData.locationservice = [];
		$scope.actualAddressData.locationopentime = [];
		$scope.actualAddressData.locationemptytime = [];
		
		//Now we check the Locationaddress etc.
		var addressisold = ObjectValueCompare.compareStringValues($scope.myCompareDataArray,$scope.actualAddressData);
		var result = null;
		if(addressisold == false){
			result = angular.copy($scope.actualAddressData);
		} else {
			result = {}
		}
		//Last but not ... the categories
		var resultcategories = LocationUpdateFilterService.compare($scope.objectToCompare.categories,$scope.myInsertDataArray.locationcategories,'fid_category','fid_category');
				
		//Set the LocationPID for Update and fill with results
		result.pid_location = $scope.objectToCompare.pid_location;
		result.resultcategories = resultcategories;
		result.resultservices = resultservices;
		result.resultcontacs = resultcontacs;
		result.resultemptytimes = resultemptytimes;
		result.resultopentimes = resultopentimes;
		console.log(result);
		
		//Lets send the shit
		var querydata = $scope.myInsertDataArray;
		var querysettings = {
			dbDataCommand	: "strUpdateLocation",
			dbDataArray		: angular.toJson(result)
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