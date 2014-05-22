mygmapAppServices.service("ObjectValueCompare", ["$rootScope", "$q", "$http", function ($rootScope, $q, $http) {
	this.compareObjectValues = function(objectA, objectB) {
		var result = true
		// Create arrays of property names if there are two objects
		if(typeof(objectA) === 'object' && typeof(objectB) === 'object'){
			var propertiesA = Object.getOwnPropertyNames(objectA);
			var propertiesB = Object.getOwnPropertyNames(objectB);
			for (var i = 0; i < propertiesA.length; i++) {
				var propName = propertiesA[i];
				// If values different not equal
				if (objectA[propName] !== objectB[propName]) {
					result = false
				}
			}
		} else {
			result = true
		}
		return result;
	}
	this.compareStringValues = function(objectA, objectB) {
		var result = true
		// Create arrays of property names if there are two objects
		if(typeof(objectA) === 'object' && typeof(objectB) === 'object'){
			var propertiesA = Object.getOwnPropertyNames(objectA);
			var propertiesB = Object.getOwnPropertyNames(objectB);
			for (var i = 0; i < propertiesA.length; i++) {
				var propName = propertiesA[i];
				strA = objectA[propName];
				strB = objectB[propName];
				//If not null
				if(strA != null && strB != null && typeof(strA) === 'string' && typeof(strB) === 'string'){
					// If Strings different not equal
					if(strA.localeCompare(strB) != 0) {
						console.log(objectA[propName] + ' / ' + objectB[propName])
						result = false
					}				
				}
				if(strA != null && strB != null && typeof(strA) === 'number' && typeof(strB) === 'number'){
					// If Strings different not equal
					if(strA == strb) {
						console.log(objectA[propName] + ' / ' + objectB[propName])
						result = false
					}				
				}

			}
		} else {
			result = true
		}
		return result;
	}
}]);