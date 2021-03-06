let loggedIn = false;
let url = 'https://gingerwald.com/community/v2.1/';
/* placeholder token for developement */
let token = 'CvBFRdXboqHC8eCOm0ONXRwtBsIWIpgYI5QZ0BsKQzHHSc3PCkg3E4su4J8P3vPa'; //TODO: remove for production
let client_id = 'GingerwaldUserApp11';
let client_secret = 'HvU5T8VcUBMV1rmjOPsLNSQ3hjsAolNQXu7kVOikJWX7vdiQpXca7UqVevZPgh8E';
let drink;
let userCredits;
let userKey;
let bottleToken;
let bottleImageLink;
let juiceIngredients;
let juiceNutrients;

angular.module('app')

.factory('loginSrv', function($http) {
    return {
        login : function(email, password) {
            return $http.post(url.concat('/authorization/oauth/token.php?grant_type=password&username=', email, '&password=', password, '&client_id=', client_id, '&client_secret=', client_secret))
                .then(function (data) {
                console.log(data);
                token = data.token; // probably not the right one
                loggedIn = true;
            }, function() {
                console.log('login failed');
                loggedIn = true; //TODO: obviously remove this code for production
            });
        }
    };
})

.factory('menuSrv', function($ionicSideMenuDelegate, $http) {
    return {
        logout : function() {
            loggedIn = false;
            window.location.replace('');
        },
        
        fetchUserData : function() {
            return $.ajax({
                type: 'GET',
                url: url.concat('api/getUserDetails.php?token=', token),
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

.factory('scanSrv', function($http, $cordovaBarcodeScanner) {
    let juiceID;
    return {
        scanBottle : function() {
            /* disabled for developement */
            return $cordovaBarcodeScanner.scan().then(function(imageData) {
                bottleToken = imageData.text.split('=')[1];
            }, function(error) {
                alert("an error occured: " + error);
            });
            /* developement code */
            /*
            return new Promise(function(resolve, reject) { 
                console.log('pretending to scan'); 
                bottleToken = 'http://qr.gingerwald.com?b=Lh3UGloz6ya624'.split('=')[1];
                resolve(bottleToken);
            });*/
        },
        fetchDrink : function() {
            return $.ajax({
                type: 'GET',
                url: url.concat('api/getBottleDetails.php?token=', token, '&bottle_token=', bottleToken),
                dataType: 'json',
                success: function(data) {
                    juiceID = data.Bottle.JuiceID;
                    bottleImageLink = url.concat('/api/getJuicePicture.php?token=', token, '&juice_id=', juiceID);
                },
                error: function() {
                    console.log('could not retrieve bottle details.');
                }
            });
        },
        fetchDrinkIngredients : function() {
            return $.ajax({
                type: 'GET',
                url: url.concat('api/getJuiceIngredients.php?token=', token, '&juice_id=', juiceID),
                dataType: 'json',
                success: function(data) {
                    juiceIngredients = data;
                    console.log(juiceIngredients);
                },
                error: function() {
                    console.log('could not retrieve juice ingredients');
                }
            });
        },
        fetchDrinkNutrients : function() {
            return $.ajax({
                type: 'GET',
                url: url.concat('api/getJuiceNutrients.php?token=', token, '&juice_id=', juiceID),
                dataType: 'json',
                success: function(data) {
                    juiceNutrients = data;
                    console.log(juiceNutrients);
                },
                error: function() {
                    console.log('could not retrieve juice nutrients');
                }
            });
        },
        getDrink : function() {
            return $.ajax({
                type: 'GET',
                url: url.concat('/api/getJuiceDetails.php?token=', token, '&juice_id=', juiceID),
                dataType: 'json',
                success: function(data) {
                    drink = data;
                },
                error: function() {
                    console.log('could not retrieve juice details');
                }
            });
        },
        addToDash : function() {
            return $.ajax({
                type: 'POST',
                url: url.concat('api/addBottleToDashboard.php?token=', token, '&bottle_token=', bottleToken),
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    console.log('added to dashboard');
                },
                error: function(err) {
                    if (err.responseText === '{"error":"invalid_request","error_description":"Bottle has already been appointed"}') {
                        alert('deze fles is al gescand');
                    } else {
                        alert(err.responseText);
                    }
                }
            });
        }
    };
})

.factory('dashboardSrv', function() {
    return {
        getUserDash : function(from = null, to = null) {
            var dashUrl = url.concat('api/getUserDashboard.php?token=', token);
            if (from !== null && to !== null) {
                dashUrl = dashUrl.concat('&report_from=', from, '&report_to=', to);
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
