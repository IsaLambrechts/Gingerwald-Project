let loggedIn = false;
let url = 'https://gingerwald.com/community/v2.1/';
/* placeholder token for developement */
let token = 'CvBFRdXboqHC8eCOm0ONXRwtBsIWIpgYI5QZ0BsKQzHHSc3PCkg3E4su4J8P3vPa';
let client_id = 'GingerwaldUserApp11';
let client_secret = 'HvU5T8VcUBMV1rmjOPsLNSQ3hjsAolNQXu7kVOikJWX7vdiQpXca7UqVevZPgh8E';
let drink;
let userCredits;
let userKey;

angular.module('app')

.factory('menuSrv', function($ionicSideMenuDelegate, $http) {
    return {
        login : function(email, password) {
           return $http.post(url.concat('/authorization/oauth/token.php?grant_type=password&username=', email, '&password=', password, '&client_id=', client_id, '&client_secret=', client_secret));
           /* return $.ajax({
                type: 'POST',
                url: url.concat('/authorization/oauth/token.php?grant_type="password"&username=', email, '&password=', password, '&client_id=', client_id, '&client_secret=', client_secret),
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function() {
                    console.log('things went wrong');
                }
            });*/
        },
        logout : function() {
            loggedIn = false;
            window.location.replace('');
        },
        
        fetchUserData : function() {
            return $.ajax({
                type: 'GET',
                url: 'https://gingerwald.com/community/v2.1/api/getUserDetails.php?token=CvBFRdXboqHC8eCOm0ONXRwtBsIWIpgYI5QZ0BsKQzHHSc3PCkg3E4su4J8P3vPa',
                dataType: 'json',
                success: function(data) {
                    userCredits = data.User.NumberCredits;
                    userKey = data.User.Login;
                },
                error: function(err) {
                    console.log('userdata not available: ' + err);
                }
            });
        },
        
        getUserData : function() {
            return {credits: userCredits, key: userKey};
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
            developement code *
            return { 
                Juice: {
                    ID: 16,
                    Name: "Cucumber Mojito",
                    CatalogNumber: 16,
                    Description: "OK, it's not the real Cuban mojito, but this is what Hemingway probably would have invented if he had a daytime job where no(t too much) alcohol was allowed.\nGo south of the border with this juice, and enjoy the easy nutrients and vitamins coming your way.",
                    PictureName: "cucumber-grape-lime-mint.png",
                    Amount_ml: 105
                }
            };*/
            return $.ajax({
                type: 'GET',
                url: url.concat('api/getBottleDetails.php?token=', token, '&bottle_token=', string),
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function() {
                    console.log('nope');
                }
            });
        },
        
        addToDash : function(bottle_token) {
            return $.ajax({
                type: 'POST',
                url: url.concat('api/addBottleToDashboard.php?token=', token, '&bottle_token=', bottle_token),
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function() {
                    console.log('nope');
                }
            });
        }
    };
})

.factory('dashboardSrv', function() {
    return {
        getUserDash : function(from, to) {
            var dashUrl = url.concat('api/getUserDashboard.php?token=', token);
            if (from !== null && to !== null) {
                dashUrl.concat('&report_from=', from, '&report_to=', to);
            }
            return $.ajax({
                type: 'GET',
                url: dashUrl,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function() {
                    console.log('nope');
                }
            });
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
		let email = 'plantijn002@gingerwald.be' // document.getElementById('email').value; // plantijn002@gingerwald.be
		let password = 'gingerjuice' // document.getElementById('password').value; // gingerjuice
        menuSrv.fetchUserData()
            .then( 
            function() {
                window.location.replace('#/menu');
            });
        /*
        menuSrv.login(email, password).then(function(data) {
            loggedIn = true;
            $location.url('menu');
        });*/
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

.controller('scanCtrl', function($scope, $cordovaBarcodeScanner, scanSrv) {
    $scope.cancel = function() {
        window.location.replace('#/menu');
    };
    
    /**
    barcodes:
    http://qr.gingerwald.com?b=Lh3UGloz6ya624
    http://qr.gingerwald.com?b=3DJ3DnJxtSem6W
    **/
    $scope.scanBarcode = function() {
        /* disabled for developement */
        console.log("attempting scan");
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            console.log("format: " + imageData.format);
            console.log("cancelled: " + imageData.cancelled);
        }, function(error) {
            alert("an error occured: " + error);
        });
        
        /* execute on success  // should respond on promise */
        drink = scanSrv.scanDrink('Lh3UGloz6ya624');
        window.location.replace('#/bottleDetails');
    };
    /* disabled for developement */
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
    };
})

.controller('juiceCtrl', function($scope, scanSrv) {
    $scope.drink = drink;
    $scope.loggedIn = loggedIn;
    
    $scope.addToDash = function() {
        /* disabled for developement
        scanSrv.addToDash('Lh3UGloz6ya624'); */
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
