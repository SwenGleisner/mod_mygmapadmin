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
			
			$scope.clickDeleteContact = function(contactObject){
				var myindex = -1 ;
				for(var i = 0; i < $scope.allcontact.contacts.length ; i++) {
					if($scope.allcontact.contacts[i].$$hashKey == contactObject.$$hashKey) {
						myindex = i;
					}
				}
				$scope.allcontact.contacts.splice(myindex, 1);		
			}
			
			$scope.clickUpdateContact = function(){
				for(var i=0; i < $scope.allcontact.contacts.length; i++) {
					if($scope.contactFormData.hashkey == $scope.allcontact.contacts[i].$$hashKey){
						 $scope.allcontact.contacts[i] = $scope.contactFormData;
					}
				}
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
				$scope.updatebtn = false;
			}
			
			$scope.clickEditContact = function(contactObject){
				$scope.updatebtn = true;
				$scope.contactFormData = {
					hashkey: contactObject.$$hashKey,
					fid_contact: contactObject.fid_contact,
					fid_location: contactObject.fid_location,
					pid_contact: contactObject.pid_contact,
					pid_locationcontact: contactObject.pid_locationcontact,
					title: contactObject.title,
					firstname: contactObject.firstname,
					surname: contactObject.surname,
					countrycode: contactObject.countrycode,
					areacode: contactObject.areacode,
					phonenumber: contactObject.phonenumber,
					callthrough: contactObject.callthrough,
					email: contactObject.email		
				};
			}
		}
	};
});