mygmapAppDirectives.directive('contact', function() {
    return {
        restrict: 'A,E',
		scope: { 
			allcontact: '='
		},
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_contact.html',
		controller: function($scope,$element, $attrs) {
						
			$scope.arrayContacts = $scope.allcontact.contacts;
						
			$scope.contactFormData = {
				title: '',
				firstname: '',
				surname: '',
				countrycode: '',
				areacode: '',
				phonenumber: '',
				callthrough: '',
				email: ''		
			};
						
			$scope.clickAddContact = function() {
				$scope.allcontact.contacts.push($scope.contactFormData);
				$scope.contactFormData = {
					title: '',
					firstname: '',
					surname: '',
					countrycode: '',
					areacode: '',
					phonenumber: '',
					callthrough: '',
					email: ''		
				};
			}
		}
	};
});