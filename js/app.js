'use strict';


// Declare app level module which depends on filters, and services
angular.module('mygmapApp', [
  'ngRoute',
  'mygmapApp.filters',
  'mygmapApp.services',
  'mygmapApp.directives',
  'mygmapApp.controllers',
  'ngSanitize',
  'perfect_scrollbar'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index', 								{templateUrl: 'modules/mod_mygmapadmin/partials/partial1.html', controller: 'landingController'});
  $routeProvider.when('/locationmanagerAllLocation',			{templateUrl: 'modules/mod_mygmapadmin/partials/partial30.html', controller: 'locationmanagerAllLocation'});
  $routeProvider.when('/locationmanagerNewLocation',			{templateUrl: 'modules/mod_mygmapadmin/partials/partial31.html', controller: 'locationmanagerNewLocation'});
  $routeProvider.when('/servicemanager',						{templateUrl: 'modules/mod_mygmapadmin/partials/partial40.html', controller: 'servicemanager'});
  $routeProvider.otherwise({redirectTo: '/index'});
}]);