mygmapApp.controller('servicemanager', ["$scope"
									  , "$rootScope"
									  , "$q"
									  ,"$http"
									  , "SharedService"
									  , "DatabaseService"
									  , function ($scope
									  			, $rootScope
												, $q
												, $http
												, SharedService
												, DatabaseService) {
	//****************
	//**	INIT	**
	//****************												
	//On Pageload get all ServiceCategorys for the Form and all Services for the Table-View
	$scope.init = function () {
		$scope.selectAllServiceCategory();
		$scope.selectAllService();
	};
	
	//Settings for Brand
	$scope.myBrand = 'Kontrollzentrum - Service-Manager';
	SharedService.setBroadcastBrand($scope.myBrand);
	SharedService.setBroadcastObjectname('');
	
	//Service-Form-Data
	$scope.arrayServiceData = {
		pid_service: null,
		customergroup: null,
		fid_category: null,
		servicename: null
	}
	
	//Form-Validation - All Fields have to be valid, if not an alert will be shown
	$scope.alertaction = 'alert-success';
	$scope.showalert = false;
	$scope.alertstring = ''
	
	$scope.serviceformValidation = function() {
		var mycustomergroup = $scope.serviceform.customergroup.$valid;
		var myfid_category = $scope.serviceform.fid_category.$valid ;
		var myservicename = $scope.serviceform.servicename.$valid ;
		if(mycustomergroup && myfid_category && myservicename) {
			return true
		}
		return false;
	}
	
	//Check if Panel is open and load the Data of the clicked Table Object into the Form-Data Array	
	$scope.clickEditService = function(serviceobject) {
		if(!$scope.opencollapsed) {
			$scope.opencollapsed = !$scope.opencollapsed;
		}
		$scope.arrayServiceData = {
			pid_service: serviceobject.pid_service,
			customergroup: serviceobject.customergroup,
			fid_category: serviceobject.fid_category,
			servicename: serviceobject.servicename
		}	
	};
	
	//Cleans an array needed after insert and update actions in the form
	$scope.objectCleaner = function(arrayToClean) {
		angular.forEach(arrayToClean,function(value,index) {
			arrayToClean[index] = null;
		})	
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
						case "strInsertService":
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
						case "strUpdateService":
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
						case "strDeleteService":
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

	//Get the Service-Categorys from Database for the Select-Field
	$scope.serviceCategorys = null;
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
		
	//Get all Services from Database for the Table
	$scope.allService = null;
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
	
	$scope.refreshAllService = function() {
		$scope.selectAllService();	
	}
		
	//Insert Form-Data in Database, but first check if Form is valid.
	$scope.clickInsertService = function() {
		$scope.showalert = false;
		angular.element('#serviceform').removeAttr('novalidate');
		if($scope.serviceformValidation()) {
			var querydata = $scope.arrayServiceData;
			querydata.fid_category = parseInt(querydata.fid_category);
			var querysettings = {
				dbDataCommand	: "strInsertService",
				dbDataArray		: angular.toJson(querydata)
			}
			
			var queryoptions = {
				beforefunctions	: null,
				afterfunctions	: [$scope.refreshAllService],
				objectsToClean	: [$scope.arrayServiceData],
			}
			$scope.dbService(queryoptions,querysettings);
			$scope.showformvalidation = false;		
		} else {
			// Form-Data handling - Show Alert and Alert-Text
			$scope.alertaction = 'alert-danger';
			$scope.showformvalidation = true;
			$scope.alertstring = 'Bitte überprüfen Sie die Eingabe für folgende Felder!';
						
		}
	}
	
	//Update in Database and refresh Table and clean Form-Data
	$scope.clickUpdateService = function() {
		$scope.showalert = false;
		angular.element('#serviceform').removeAttr('novalidate');
		if($scope.serviceformValidation()) {
			var querydata = $scope.arrayServiceData;
			querydata.pid_service = parseInt(querydata.pid_service);
			querydata.fid_category = parseInt(querydata.fid_category);
			querydata.customergroup = '' + querydata.customergroup;
			var querysettings = {
				dbDataCommand	: "strUpdateService",
				dbDataArray		: angular.toJson(querydata)
			}
			
			var queryoptions = {
				beforefunctions	: null,
				afterfunctions	: [$scope.refreshAllService],
				objectsToClean	: [$scope.arrayServiceData]
			}
			$scope.dbService(queryoptions,querysettings);
			$scope.showformvalidation = false;
		} else {
			// Form-Data handling - Show Alert and Alert-Text
			$scope.alertaction = 'alert-danger';
			$scope.showformvalidation = true;
			$scope.alertstring = 'Bitte überprüfen Sie die Eingabe für folgende Felder!';
						
		}
	}
	
	//Delete from Database and refresh Table and clean Form-Data
	$scope.clickDeleteService = function(serviceobject) {
		var querydata = serviceobject;
		querydata.pid_service = parseInt(querydata.pid_service);
		var querysettings = {
			dbDataCommand	: "strDeleteService",
			dbDataArray		: angular.toJson(querydata)
		}
		
		var queryoptions = {
			beforefunctions	: null,
			afterfunctions	: [$scope.refreshAllService],
			objectsToClean	: [$scope.arrayServiceData]
		}
		$scope.dbService(queryoptions,querysettings);
	}
}]);