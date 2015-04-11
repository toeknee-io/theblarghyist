(function() {
  
	var app = angular.module('theblarghyist', ['webcam']);

	app.factory('socket', function ($rootScope) {
      var socket = io.connect();
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          });
        }
      };
	});      	

  	app.controller('BlarghCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {
    
        $scope.onStream = function() {
  			$scope.$log = $log;
  			$log.debug('test!');
  			$scope.socket.emit('test', 'test');
  		};
  		
        $scope.onSuccess = function(stream) {
  			$scope.$log = $log;
  			$scope.message = 'Hello World!';
  			$log.debug('test!');
  			$scope.socket.emit('test', 'test');
  			$scope.socket.emit('stream', stream);  			
  		};  		

  }]);


})();