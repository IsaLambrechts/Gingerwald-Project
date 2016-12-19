let loggedIn = false;
let url = 'https://gingerwald.com/community/v2.1/';
/* placeholder token for developement */
let token = 'CvBFRdXboqHC8eCOm0ONXRwtBsIWIpgYI5QZ0BsKQzHHSc3PCkg3E4su4J8P3vPa';
let drink;

angular.module('app')

.factory('menuSrv', function($ionicSideMenuDelegate) {
    return {
        logout : function() {
            loggedIn = false;
            window.location.replace('');
        },

        redirect : function(location) {
            window.location.replace('#/' + location);
        },

        toggleMenu : function() {
            $ionicSideMenuDelegate.toggleLeft();
        }
    };
})

.factory('scanSrv', function($http) {
    return {
        scanDrink : function(string) {
            /* disabled for developement
            return $http.jsonp(url + 'api/getJuiceDetails.php?token=' + token + '&bottle_token=' + string);
            developement code */
            return {
                Juice: {
                    ID: 16,
                    Name: "Cucumber Mojito",
                    CatalogNumber: 16,
                    Description: "OK, it's not the real Cuban mojito, but this is what Hemingway probably would have invented if he had a daytime job where no(t too much) alcohol was allowed.\nGo south of the border with this juice, and enjoy the easy nutrients and vitamins coming your way.",
                    PictureName: "cucumber-grape-lime-mint.png",
                    Amount_ml: 105
                }
            };
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
        loggedIn = true;
        $location.url('menu');
	};

    $scope.scan = function() {
        $location.url('scan');
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

.controller('scanCtrl', function($scope, $cordovaBarcodeScanner, scanSrv) {
    $scope.cancel = function() {
        window.location.replace('#/menu');
    };

    $scope.scanBarcode = function() {
        /* disabled for developement
        console.log("attempting scan");
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            console.log("format: " + imageData.format);
            console.log("cancelled: " + imageData.cancelled);
        }, function(error) {
            alert("an error occured: " + error);
        });
        */
        /* execute on success  // should respond on promise */
        drink = scanSrv.scanDrink(16);
        window.location.replace('#/bottleDetails');
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

.controller('juiceCtrl', function($scope) {
    $scope.drink = drink;
    $scope.loggedIn = loggedIn;

    $scope.addToDash = function() {
        window.location.replace('#/dashboard');
    };

    $scope.cancel = function() {
        window.location.replace('#/menu');
    };

    $scope.login = function() {
        /* login logic */
        loggedIn = $scope.loggedIn = true;
        window.location.replace('#/bottleDetails');
    }
})

.controller('dashboardCtrl', function($scope, $http){
  $scope.divShow = "week"
  $scope.show = function(x) {
    if(x == 'week'){
      $scope.divShow = "week";
      $scope.start = moment().startOf('week');
      $scope.end = moment().endOf('week');
      $scope.startWeek = $scope.start.format("DD/MM");
      $scope.endWeek = $scope.end.format("DD/MM");
      $scope.back = function(){
        $scope.startWeek = $scope.start.add(-1, 'weeks').format("DD/MM");
        $scope.endWeek = $scope.end.add(-1, 'weeks').format("DD/MM");
      }
      $scope.forward = function(){
        $scope.startWeek = $scope.start.add(1, 'weeks').format("DD/MM");
        $scope.endWeek = $scope.end.add(1, 'weeks').format("DD/MM");
      }
    }else if(x == 'maand'){
      $scope.divShow = "maand";
      $scope.start = moment().startOf('month');
      $scope.end = moment();
      $scope.startMonth = $scope.start.format("DD/MM");
      $scope.endMonth = $scope.end.endOf('month').format("DD/MM");
      $scope.back = function(){
        $scope.startMonth = $scope.start.add(-1, 'months').format("DD/MM");
        $scope.endMonth = $scope.end.add(-1, 'months').endOf('month').format("DD/MM");
      }
      $scope.forward = function(){
        $scope.startMonth = $scope.start.add(1, 'months').format("DD/MM");
        $scope.endMonth = $scope.end.add(1, 'months').endOf('month').format("DD/MM");
      }
    }else{
      $scope.divShow = "ever";
    }
  }
})
