var app = angular.module("autoCompleteApp", []);

app.controller("formController", ["$scope", "$http", "$interval", function($scope, $http, $interval) {
    $scope.resultList = [];
    $scope.productDetail = null;
    $scope.message = null;
    $scope.currentCursor = -1; //current highlighted record when up & down arrow moves
    var stop;

    $scope.moveHelper = function(code) {
        if ($scope.resultList.length === 0) {
            return;
        }

        if (code === 38) {
            if ($scope.currentCursor === -1) {
                $scope.currentCursor = $scope.resultList.length - 1;
                return;
            }
            $scope.currentCursor--;
        }
        if (code === 40) {
            if ($scope.currentCursor === $scope.resultList.length - 1) {
                $scope.currentCursor = -1;
                return;
            }
            $scope.currentCursor++;
        }
    }

    $scope.move = function(event) {
        if (stop) {
            return;
        }
        $scope.moveHelper(event.keyCode);
        stop = $interval($scope.moveHelper.bind($scope,event.keyCode), 200);
    }

    $scope.complete = function(event) {
        $interval.cancel(stop);
        stop = undefined;
        if (event.keyCode === 13) {
            //return key pressed , submit form
            if ($scope.resultList.length === 0) {
                return false;
            }
            $scope.product = $scope.resultList[$scope.currentCursor];
            $scope.submit();
        }
        if (!$scope.product || $scope.product.replace(/^\s+|\s+$/g, '').length === 0) {
            return;
        }
        var term = $scope.product.replace(/^\s+|\s+$/g, '');
        $http.get('/complete?term=' + term).then(function(response) {
            $scope.resultList = response.data;
        }, function(response) {
            //if error happens
            //just not show
        });
    }


    $scope.fillForm = function(name) {
            $scope.product = name;
            $scope.submit( true );
        }
        //submit form to get detail of the product
    $scope.submit = function( fromClick ) {
        //return key pressed , submit form
        if ($scope.resultList.length > 0 && $scope.currentCursor >= 0 && !fromClick ) {
            $scope.product = $scope.resultList[$scope.currentCursor];
        }
        $scope.resultList.length = 0;
        $scope.message = null;
        $scope.productDetail = null;
        if (!$scope.product) {
            return false;
        }
        $http.get('/product?name=' + $scope.product).then(function(response) {
            if (response.data.length === 0) {
                $scope.message = "No match records";
                return;
            }
            $scope.productDetail = response.data;
        }, function(response) {
            $scope.error = "Failed to get the data, please try again";
        })
    }
}]);