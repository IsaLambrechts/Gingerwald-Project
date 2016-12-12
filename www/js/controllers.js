let loggedin = false;

angular.module('app')

.factory('menuSrv', function($ionicSideMenuDelegate, $window) {
    return {
        getLoggedIn : function() {
            return loggedin;
        },

        login : function() {
            loggedin = true;
        },

        logout : function() {
            loggedin = false;
            window.location.replace('');
        },

        redirect : function(location) {
            //window.location.replace('/#/' + location);
            $window.location.href = '/#/' + location;
        },

        toggleMenu : function() {
            $ionicSideMenuDelegate.toggleLeft();
        }
    };
})

.controller('sideMenuCtrl', function($scope, menuSrv) {

        // sidemenu
    $scope.$on('$locationChangeStart', function(event) {
        $scope.loggedin = menuSrv.getLoggedIn();
    });
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
        menuSrv.login();
		let email = document.getElementById('email').value; // plantijn002@gingerwald.be
		let password = document.getElementById('password').value; // gingerjuice
		//window.location.replace('/#/menu');
        $location.url('menu');
	}
})

.controller('menuCtrl', function($scope, $location) {

    $scope.redirect = function(location) {
        $location.url('scan');
    };

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
