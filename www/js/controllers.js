angular.module('app')

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

.controller('loginCtrl', function($scope, $location, loginSrv, menuSrv) {
	$scope.login = function() {
		let email = document.getElementById('email').value; // plantijn002@gingerwald.be
		let password = document.getElementById('password').value; // gingerjuice
        loginSrv.login()
        .then(function() {
            menuSrv.fetchUserData()
            .then(function() {
                if (drink != null) {
                    window.location.replace('#/bottleDetails');
                } else {
                    window.location.replace('#/menu');
                }
            });
        });
	};
    
    $scope.scan = function() {
        $location.url('scan');
    }
})

.controller('menuCtrl', function($scope, menuSrv) {

    $scope.redirect = function(location) {
        window.location.replace('#/' + location); };

    $scope.user = menuSrv.getUserData();

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

.controller('scanCtrl', function($scope, scanSrv) {
    $scope.cancel = function() {
        window.location.replace('#/menu');
    };
    
    /**
    barcodes:
    http://qr.gingerwald.com?b=Lh3UGloz6ya624
    http://qr.gingerwald.com?b=3DJ3DnJxtSem6W
    **/
    $scope.scanBarcode = function() {
        scanSrv.scanBottle().then(function() {
            scanSrv.fetchDrink().then(function() {
                scanSrv.getDrink().then(function() {
                    window.location.replace('#/bottleDetails');
                });
            });
        });
    };
    /* disabled for developement
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);

    function checkPermissionCallback(status) {
      if(!status.hasPermission) {
        var errorCallback = function() {
          console.warn('Camera permission is not turned on');
        }

        permissions.requestPermission(
          permissions.CAMERA,
          function(status) {
            if(!status.hasPermission) errorCallback();
          },
          errorCallback);
      }
    };*/
})

.controller('juiceCtrl', function($scope, scanSrv) {
    $scope.drink = drink;
    $scope.loggedIn = loggedIn;
    
    $scope.addToDash = function() {
        /* disabled for developement */
        scanSrv.addToDash().then(function() {
            window.location.replace('#/dashboard');
        });
        //window.location.replace('#/dashboard');
    };
    
    $scope.cancel = function() {
        window.location.replace('#/menu');
    };
    
    $scope.login = function() {
        window.location.replace('#/login');
    }
})

.controller('dashboardCtrl', function($scope, $http){
  /*let url = "https://www.gingerwald.com/community/v2.1/api/getUserDetails.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&callback=JSON_CALLBACK";
  $http.jsonp(url)
  .success(function(data){
    console.log(data);
    console.log("werkt");
  })
  .error(function(){
    console.log("kut");
  })*/
  console.log(moment().startOf('week').fromNow());
  console.log(moment().weekday(0));

})
