mygmapAppDirectives.directive('timetable', function factory() {
    return {
        restrict: 'E',
		scope: { 
			headline: '=' ,
			time: '='
		},
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_timetable.html',
		controller: function($scope) {

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
						
			//If Update we need
			$scope.pid_timetable = null;
			$scope.fid_ttcategory = null;
			$scope.fid_ttfid_location = null;
					
			$scope.arrayAddOpenTime = {
				pid_opentime: null,
				day: null,
				from: null,
				to: null
			}
			
			$scope.arrayOpenTimes = [];
			
			//we have an update if array is filled with objects
			//comes in format
			//[{"pid_timetable":"12","fid_category":"2","fid_location":"67","pid_time":"27","day":"0","from":"18:00:00","to":null,"fid_timetable":"12"}
			//but we need
			//{"times":[{"pid_opentime":null,"day":{"id":"0","name":"Montag","counter":1},"from":"02:00","to":null}]}
			if($scope.time.length > 0){
				$scope.pid_timetable = $scope.time[0].pid_timetable;
				$scope.fid_ttcategory = $scope.time[0].fid_category;
				$scope.fid_ttfid_location = $scope.time[0].fid_location;
				//$scope.arrayOpenTimes = $scope.time;
				for(var i=0;i < $scope.time.length;i++){
					var convertedday = {};
					for(var j=0;j < $scope.arrayWeekdays.length;j++){
						if($scope.arrayWeekdays[j].id == $scope.time[i].day){
							$scope.arrayWeekdays[$scope.time[i].day].counter += 1;
							convertedday = {"id": $scope.time[i].day,
							  	   			"name":$scope.arrayWeekdays[j].name,
							  	   			"counter": $scope.arrayWeekdays[$scope.time[i].day].counter
							  	  }
						}
					}
					var convfrom = null;
					var convto = null;
					convfrom = $scope.time[i].from.substring(0, $scope.time[i].from.length - 3)
					if($scope.time[i].to){
						convto = $scope.time[i].to.substring(0, $scope.time[i].to.length - 3)
					}
					
					$scope.arrayAddOpenTime = {
						pid_opentime: $scope.time[i].pid_time,
						day: convertedday,
						from: convfrom,
						to: convto
					}
					$scope.arrayOpenTimes.push($scope.arrayAddOpenTime)
				}
				$scope.arrayAddOpenTime = {
					pid_opentime: null,
					day: null,
					from: null,
					to: null
				}
			}
			
			$scope.time.times = $scope.arrayOpenTimes;
			

			
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
				console.log(myobject);
				var myindex = -1 ;
				for(var i = 0; i < $scope.arrayOpenTimes.length ; i++) {
					if($scope.arrayOpenTimes[i].$$hashKey == myobject.$$hashKey) {
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