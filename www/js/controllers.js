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
		/*
		let url = "https://www.gingerwald.com/community/v2.1/authorization/oauth/token.php?grant_type=password&username=" +
		email + "&password=" +
		password + "&client_id=GingerwaldUserApp11&client_secret=HvU5T8VcUBMV1rmjOPsLNSQ3hjsAolNQXu7kVOikJWX7vdiQpXca7UqVevZPgh8E";

        console.log(url);

		console.log(email, password);
		$.ajax({
			type: "POST",
			url: url,
            error: function() {
                console.log("shit's fucked");
            }
		}).then(function() {
			console.log('okiday');
		})

		//let url = "https://www.gingerwald.com/community/v2.1/api/getUserDetails.php?token=HvU5T8VcUBMV1rmjOPsLNSQ3hjsAolNQXu7kVOikJWX7vdiQpXca7UqVevZPgh8E";

        /*
		$.ajax({
			url: url,
			type: "GET",
			dataType: "jsonp",
			success: function(data) {
				console.log(data);
			},
			error: function() {
				console.log("alles kapot");
			}
		});

		$http.jsonp(url)
		.success(function() {
			console.log('jeuj');
		})
		.error(function(){
			console.log("fuck");
		});
		*/
		window.location.replace('/#/menu');
		//$window.location.href = '/#/menu';
        //document.getElementsByTagName('ion-header-bar')[0].style.visibility = "initial";
        //$location.url('menu');
	}
})

.controller('menuCtrl', function($scope, $window) {

    $scope.redirect = function(location) {
        //window.location.replace('#/' + location);
        $window.location.href = '/#/' + location;
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
