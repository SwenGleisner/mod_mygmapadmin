'use strict';

/* Services */
var mygmapAppServices = angular.module('mygmapApp.services', []);

mygmapAppServices.factory('SharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.pid = '';
	sharedService.objectname = '';
	sharedService.brand = '';
	sharedService.sharedLocation = '';

    sharedService.setSharedLocation = function(sharedLocation) {
		this.sharedLocation = sharedLocation;
        this.broadcastItem();
    };
	
    sharedService.setBroadcastPID = function(pid,objectname) {
		this.pid = pid;
		this.objectname = ' - ' + objectname;
        this.broadcastItem();
    };

    sharedService.setBroadcastObjectname = function(objectname) {
		if(objectname.length > 0) {
			this.objectname = ' - ' + objectname;
		} else {
			this.objectname = objectname;
		}
        this.broadcastItem();
    };
	
    sharedService.setBroadcastBrand = function(brand) {
		this.brand = brand;
        this.broadcastItem();
    };
		
    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});

mygmapAppServices.service("DatabaseService", ["$rootScope", "$q", "$http", function ($rootScope, $q, $http) {
	var defaultSettings = {
		dbMethod		: 'POST',
		dbURL			: 'index.php?option=com_ajax&module=mygmapadmin&format=json',
		dbDataCommand	: null,
		dbDataArray		: null,
		dbHeader		: {'Content-Type': 'application/x-www-form-urlencoded'}
	}
	
	this.query = function(querydata,querysettings) {
		var deferred = $q.defer();
			$http({method: defaultSettings.dbMethod, 
				   url: defaultSettings.dbURL,
				   data:  {cmd: querysettings.dbDataCommand, data: querydata},
				   headers: defaultSettings.dbHeader
				  })
				.success(function(result) {
					setTimeout(function() {
						$rootScope.$apply(function () {
							deferred.resolve(result);
						});
					},1000)
				})
				.error(function(result) {
					$rootScope.$apply(function () {
						deferred.reject(error);
					});
				});
		return deferred.promise;
	}
}]);







