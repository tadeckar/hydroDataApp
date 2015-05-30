'use strict';

var restProjects = [];

/*$(document).ready(function(){
	populateTable();
	// jQuery AJAX call to get the project data from Jira
});*/


var projData = [];
var catData = [];

// Function to load from the db
/*var populateTable = function () {
	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/dataStore/category', function(data) {
		catData = data;
	});
	$.getJSON( '/dataStore/projects', function(data) {
		projData = data;
	});
}*/

angular.module('hydroDataAppModule', [
'ngRoute',
'ui.bootstrap'
], function($httpProvider) {
	//disables caching (IE fix)
	//initialize get if not there
	    if (!$httpProvider.defaults.headers.get) {
	        $httpProvider.defaults.headers.get = {};
	    }
	    //disable IE ajax request caching
	    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

	// Use x-www-form-urlencoded Content-Type
	  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	  /**
	   * The workhorse; converts an object to x-www-form-urlencoded serialization.
	   * @param {Object} obj
	   * @return {String}
	   */
	  var param = function(obj) {
	    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

	    for(name in obj) {
	      value = obj[name];

	      if(value instanceof Array) {
	        for(i=0; i<value.length; ++i) {
	          subValue = value[i];
	          fullSubName = name + '[' + i + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value instanceof Object) {
	        for(subName in value) {
	          subValue = value[subName];
	          fullSubName = name + '[' + subName + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value !== undefined && value !== null)
	        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	    }

	    return query.length ? query.substr(0, query.length - 1) : query;
	  };

	  // Override $http service's default transformRequest
	  $httpProvider.defaults.transformRequest = [function(data) {
	    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	  }];
}).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/viewData', {templateUrl: 'partials/viewData.html', controller: 'viewDataController'})
	$routeProvider.when('/resChange', {templateUrl: 'partials/resChange.html', controller: 'resChangeController'})
    $routeProvider.when('/', {templateUrl: 'partials/menu.html', controller: 'resChangeController'})
	// Anything else, go to home.
	$routeProvider.otherwise({redirectTo: '/'});
}]).service('passResChangeToEdit', function () {
	var resChange = {};

	function setResChange (obj) {
		resChange = obj;
	}

	function getResChange () {
		return resChange;
	}

	return {
		setResChange: setResChange,
		getResChange: getResChange
	};
});
