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
            /* disabled for developement
            return $cordovaBarcodeScanner.scan().then(function(imageData) {
                bottleToken = imageData.text.substring(27, 41);
            }, function(error) {
                alert("an error occured: " + error);
            });*/
            /* developement code */
            return new Promise(function(resolve, reject) { 
                console.log('pretending to scan'); 
                bottleToken = 'http://qr.gingerwald.com?b=Lh3UGloz6ya624'.substring(27, 41);
                resolve(bottleToken);
            });
        },
        fetchDrink : function() {
            return $.ajax({
                type: 'GET',
                url: url.concat('api/getBottleDetails.php?token=', token, '&bottle_token=', bottleToken),
                dataType: 'json',
                success: function(data) {
                    juiceID = data.Bottle.JuiceID;
                },
                error: function() {
                    console.log('could not retrieve bottle details.');
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