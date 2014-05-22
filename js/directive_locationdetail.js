mygmapAppDirectives.directive('locationdetail', function factory() {
    return {
        restrict: 'E',
		scope: { 
			location: '=' ,
			showmodal: '=',
			servicecategories: '='
		},
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_locationdetail.html',
		controller: function($scope) {
			$scope.myservicecategories = [];			
			$scope.init = function() {
				$scope.myservicecategories = $scope.servicecategories;
			}
			//$scope.myservicecategories = $scope.servicecategories;
		}
	};
});