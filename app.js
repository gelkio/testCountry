var testApp = angular.module('testApp', []);

testApp.controller('CountryController',['$http', function($http){
    var context = this;
    
    context.countries = [];
    
    $http({method: 'GET', 
           url: 'http://localhost:9090'}
    ).then(function(response){
        context.countries = response.data;
    }, function(response){
        
    });
}]);