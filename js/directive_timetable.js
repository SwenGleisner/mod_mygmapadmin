mygmapAppDirectives.directive('timetable', function factory() {
    return {
        restrict: 'E',
		scope: { 
			headline: '=' ,
			time: '='
		},
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_timetable.html',
		controller: function($scope) {
						
			$scope.arrayAddOpenTime = {
				pid_opentime: null,
				day: null,
				from: null,
				to: null
			}
			
			$scope.arrayOpenTimes = [];
			$scope.time.times = $scope.arrayOpenTimes;
			
			$scope.arrayWeekdays = [
				{id : '0' , name : 'Montag' 	, counter: 0},
				{id : '1' , name : 'Dienstag' 	, counter: 0},
				{id : '2' , name : 'Mittwoch' 	, counter: 0},
				{id : '3' , name : 'Donnerstag' , counter: 0},
				{id : '4' , name : 'Freitag' 	, counter: 0},
				{id : '5' , name : 'Samstag'	, counter: 0},
				{id : '6' , name : 'Sonntag'	, counter: 0},
			];
			
			$scope.checkCounter = function(weekdayid) {
				var mybool = false
				if($scope.arrayWeekdays[weekdayid].counter > 0) {
					mybool = true;
				}
				return mybool;
			}
			
			$scope.clickAddToArrayOpenTimes = function() {
				if($scope.arrayAddOpenTime.day != '' && $scope.arrayAddOpenTime.from != '' && $scope.arrayAddOpenTime.to != '') {
					$scope.arrayOpenTimes.push($scope.arrayAddOpenTime);
					$scope.arrayWeekdays[$scope.arrayAddOpenTime.day.id].counter += 1;
					$scope.arrayAddOpenTime = {
						pid_opentime: null,
						day: null,
						from: null,
						to: null
					}
		
				}
			}
			
			$scope.clickRemoveFromArrayOpenTimes = function(myobject) {
				var myindex = -1 ;
				for(var i = 0; i < $scope.arrayOpenTimes.length ; i++) {
					if($scope.arrayOpenTimes.$$hashKey == myobject.$$hashKey) {
						myindex = i;
					}
				}
				$scope.arrayWeekdays[myobject.day.id].counter -= 1;
				$scope.arrayOpenTimes.splice(myindex, 1);
			}	
		}
	};
});

mygmapAppDirectives.directive('timetabletimepicker', function() {
	return {
		restrict: 'AE',
		replace: true,
		scope: {},
		template: '<input class="mytimepicker input-small" type="text">',
		link: function ($scope, $elem, attrs) {
		   	var attr;
			for (attr in attrs.$attr) {
				if(attrs == "ng-model"){
					element.attr(attr, attrs[attr]);
				}
			}
			$elem.timepicker({
				minuteStep: 1,
				template: 'dropdown',
				appendWidgetTo: 'body',
				showSeconds: false,
				showMeridian: false,
				defaultTime: false
			});
		}
	}
});