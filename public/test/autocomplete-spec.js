describe("formController",function(){
	var $rootScope,$scope,controller;
	beforeEach(function(){
		module('autoCompleteApp');
		inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('formController',{$scope:$scope});
		});
	});

	describe("initialize",function(){
		it("scope variable initialize",function( ){
			expect($scope.currentCursor).toEqual(-1);
			expect($scope.resultList.length).toEqual(0);
			expect($scope.productDetail).toBe(null);
			expect($scope.message).toBe(null);
		})
	});

	describe("actions",function(){
		describe("moveHelper",function(){
			it("Should increase the cursor",function(){
				$scope.resultList = ['test1','test2'];
				$scope.moveHelper(40);
				expect($scope.currentCursor).toEqual(0);
			})
			it("Should decrease the cursor",function(){
				$scope.resultList = ['test1','test2'];
				$scope.currentCursor = 1;
				$scope.moveHelper(38);
				expect($scope.currentCursor).toEqual(0);
			});
			it("Should not exceed the length of result list",function(){
				$scope.resultList = ['test1','test2'];
				$scope.currentCursor = 1;
				$scope.moveHelper(40);
				expect($scope.currentCursor).toEqual(-1);
			});
			it("Should not increase or decrease if result list is empty",function(){
				$scope.resultList = [];
				$scope.currentCursor = -1;
				$scope.moveHelper(40);
				expect($scope.currentCursor).toEqual(-1);
				$scope.moveHelper(38);
				expect($scope.currentCursor).toEqual(-1);
			});
		});
	});
});