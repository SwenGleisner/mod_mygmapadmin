mygmapAppDirectives.directive('geodata', function() {
    return {
        restrict: 'A,E',
		scope: { address: '=' },
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_geodata.html',
		controller: function($scope, $element, $attrs, $rootScope, $q) {			
			$scope.myGeodataResultArray = [];
			$scope.myGeoSelect = {selected: ''};

			getGeodata = function($rootScope, $q, address) {
				var deferred = $q.defer();
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

			$scope.clickSearchGeodata = function() {
				var address = $scope.address.street + ' ' + $scope.address.housenr + ' ' + $scope.address.zipcode + ' ' + $scope.address.locality
				var getGeodataLocationPromise = getGeodata($rootScope, $q, address);
				getGeodataLocationPromise.then(function(arrResult) {
					if(arrResult.length > 1) {
						$scope.myGeodataResultArray = arrResult;
						jQuery('#myModal').modal('show');
					}
					if(arrResult.length == 1) {
						$scope.address['latitude'] = arrResult[0].geometry.location.lat();
						$scope.address['longitude'] = arrResult[0].geometry.location.lng();
					}	
				}, function(error) {
					alert('Error: ' + error);
				});	
			};
		
			$scope.clickSelectGeodata = function() {
				$scope.address['latitude'] = $scope.myGeoSelect.selected.geometry.location.lat();
				$scope.address['longitude'] = $scope.myGeoSelect.selected.geometry.location.lng();
				jQuery('#myModal').modal('hide');
			};
			
			$scope.clickClearGeodata = function() {
				jQuery('#myModal').modal('hide');
			};
		}
	};
});