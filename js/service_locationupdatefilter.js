mygmapAppServices.service("LocationUpdateFilterService", ["$rootScope", "$q", "$http","ObjectValueCompare", function ($rootScope, $q, $http,ObjectValueCompare) {
	this.compare = function(objectToCompare, objectNew, pk,fk) {

		//Pick out the services to delete or add
		var result = {
			objectsToDelete: [],
			objectsAdd: [],
			objectsToUpdate: []		
		}
		
		for(var i=0; i < objectToCompare.length; i++){
			var found = false
			for(var j=0; j < objectNew.length; j++){
				if(typeof(objectToCompare[i]) === 'object' && typeof(objectNew[j]) === 'object'){
					if(objectToCompare[i][pk] ==  objectNew[j][fk]) {
						found = true;
					}					
				} else {
					if(objectToCompare[i][pk] ==  objectNew[j]) {
						found = true;
					}
				}

			}
			if(found == false){
				result.objectsToDelete.push(objectToCompare[i]);
			}
		}
		for(var i=0; i < objectNew.length; i++){
			var found = false
			for(var j=0; j < objectToCompare.length; j++){
				if(typeof(objectToCompare[j]) === 'object' && typeof(objectNew[i]) === 'object'){
					if(objectToCompare[j][pk] ==  objectNew[i][fk]) {
						found = true
						var oldobj = objectToCompare[j];
						var newobj = objectNew[i];
						if(ObjectValueCompare.compareObjectValues(oldobj,newobj) == false){
							result.objectsToUpdate.push(objectNew[i])
						}
					}					
				} else {
					if(objectToCompare[j][pk] ==  objectNew[i]) {
						found = true
						var oldobj = objectToCompare[j];
						var newobj = objectNew[i];
						if(ObjectValueCompare.compareObjectValues(oldobj,newobj) == false){
							result.objectsToUpdate.push(objectNew[i])
						}
					}
				}
			}
			if(found == false){
				result.objectsAdd.push(objectNew[i]);
			}
		}		
		return result
	}
}]);