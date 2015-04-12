(function() {
  
	var app = angular.module('theblarghyist', ['webcam']);
	
    app.factory('socket', function ($rootScope) {
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

    app.controller('BlarghCtrl', function ($scope) {
        $scope.onStream = function (stream) {
            socket.on('webcamCtrl', 'controller test!');
        }
    });
    
})();