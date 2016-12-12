angular.module('app')

.factory('menuSrv', function($ionicSideMenuDelegate) {
    return {
        logout : function() {
            window.location.replace('');
        },
        
        redirect : function(location) {
            window.location.replace('/#/' + location);
        },

        toggleMenu : function() {
            $ionicSideMenuDelegate.toggleLeft();
        }
    };
})

.controller('sideMenuCtrl', function($scope, menuSrv) {
    $scope.redirect = function(location) { 
        menuSrv.toggleMenu();
        menuSrv.redirect(location); 
    };
    $scope.toggleMenu = function() { menuSrv.toggleMenu(); };
    $scope.logout = function() { 
        menuSrv.logout(); 
    };
})

.controller('loginCtrl', function($scope, $http, $location, menuSrv) {
	$scope.login = function() {
		let email = document.getElementById('email').value; // plantijn002@gingerwald.be
		let password = document.getElementById('password').value; // gingerjuice
        $location.url('menu');
	}
})

.controller('menuCtrl', function($scope) {
    
    $scope.redirect = function(location) { 
        window.location.replace('#/' + location); };
    
    $scope.key;
	$scope.credits;
    
    $scope.user = {key: 'placeholder', credits: '12345'};
    
    $scope.drinks = function() {
        console.log("drink function");
    };
    $scope.cart = function() {
        console.log("cart function");
    };
    $scope.stats = function() {
        console.log("stats function");
    };
})

.controller('scanCtrl', function($scope) {
    $scope.menu = function(location) {
        window.location.replace('#/' + location);
    }
})