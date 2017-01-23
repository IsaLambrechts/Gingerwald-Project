var names = [];
var amount = [];
var namesN = [];
var amountN = [];
var grouped = [];
var groupedN = [];

angular.module('app')

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
                  for(var i = 0; i < data.Ingredients.length ; i++){
                    names.push(data.Ingredients[i].Ingredient.Name);
                    amount.push(data.Ingredients[i].Ingredient.Amount_g);
                  }
                  for(var i = 0; i < data.Nutrients.length; i++){
                    namesN.push(data.Nutrients[i].Nutrient.Name);
                    amountN.push(data.Nutrients[i].Nutrient.Amount_g);
                  }
                  for(var i = 0; i < names.length; i++){
                    grouped.push({"label": names[i], "value": amount[i]})
                  }

                  for (var i = 0; i < namesN.length; i++) {
                    groupedN.push({"label": namesN[i], "value": amountN[i]});
                  }


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
        /* disabled for developement 
        scanSrv.addToDash().then(function() {
            window.location.replace('#/added');
        });*/
        window.location.replace('#/added');
    };
    
    $scope.cancel = function() {
        window.location.replace('#/menu');
    };
    
    $scope.login = function() {
        window.location.replace('#/login');
    }
    
    $scope.toDash = function() {
        window.location.replace('#/dashboard');
    }
})

.controller('dashboardCtrl', function($scope, $http, dashboardSrv){
  $scope.grouped = [];
  $scope.group = [];
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

  console.log(dashboardSrv.getUserDash());
  $scope.names = names;
  $scope.amount = amount;
  $scope.namesN = namesN;
  $scope.amountN = amountN;
  $scope.grouped = grouped;
  $scope.groupedN = groupedN;

  console.log($scope.grouped)
  $scope.options = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showControls: false,
                showValues: false,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Hoeveelheid',
                    axisLabelDistance: 20,
                    tickFormat: function(d){
                        return d3.format(',.6f')(d);
                    }
                }
            }
    };

    $scope.data = [{
      "key": "ingredients",
      "values": $scope.grouped
    }]

    $scope.ingredients = function(){
      $scope.data = [{
        "key": "ingredients",
        "values": $scope.grouped
      }]
    }
    $scope.nutrients = function(){
      $scope.data = [{
        "key": "nutrients",
        "values": $scope.groupedN
      }]

    }

})
