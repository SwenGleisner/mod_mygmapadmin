function Location() {

	this.locationname = '';
    this.additiontoaddress = '';
	this.street = '';
	this.housenr = '';
	this.zipcode = '';
	this.locality = '';
	this.longitude = '';
	this.latitude = '';
	this.getData = null;

	this.init = function(arrData) {
		getData = arrData;
		locationname = arrData['locationname'];
		additiontoaddress = arrData['additiontoaddress'];
		street = arrData['street'];
		housenr = arrData['housenr'];
		zipcode = arrData['zipcode'];
		locality = arrData['locality'];
		longitude = arrData['longitude'];
		latitude = arrData['latitude'];
	}
	
	this.dbInsert = function(LocationService) {
		var insertLocationPromise = LocationService.insertLocation(angular.toJson(getData));
		insertLocationPromise.then(function(arrResult) {
			console.log(arrResult);
		}, function(error) {
			alert('Error: ' + error);
		});
	}
	
	this.searchGeodata = function($rootScope, $q) {
		var deferred = $q.defer();
		var address = street + ' ' + housenr + ' ' + zipcode + ' ' + locality ;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				setTimeout(function() {
					$rootScope.$apply(function () {
					if(results.length == 1) {
						latitude = results[0].geometry.location.lat();
						longitude = results[0].geometry.location.lng();
					}
						deferred.resolve(results);
					});
				},1000)
	
			} else {
				setTimeout(function() {
					$rootScope.$apply(function () {
						deferred.resolve(status);
					});
				},1000)
			}
	  	});
		return deferred.promise;
	}
	
	//DB-Object for this Controller - handles the requests for select, update and insert calls
	//It calls the DatabaseService and listen for a result.	
	$scope.dbService = function(queryoptions,querysettings) {
		var dbServicePromise = DatabaseService.query(querysettings.dbDataArray,querysettings);
			dbServicePromise.then(function(result) {
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
}