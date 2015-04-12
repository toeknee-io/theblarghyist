(function() {
/*  
(function() {
  // GetUserMedia is not yet supported by all browsers
  // Until then, we need to handle the vendor prefixes
  navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  // Checks if getUserMedia is available on the client browser
  window.hasUserMedia = function hasUserMedia() {
    return navigator.getMedia ? true : false;
  };
})();  
*/  
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

  app.controller('BlarghCtrl', ['$scope', '$http', function ($scope, $http) {
      $scope.onReady = function (videoElem) {
        if($scope.streamSrc == '') {
          $http.get('/src').then(function(result) {
            window.console.log('Src from server:', result.data);
          });  
        } else {
        }
      };
  }]);
    
  app.directive('receive', function () {
    return {
      template: '<div class="receive" ng-transclude></div>',
      restrict: 'E',
      controller: 'BlarghCtrl',
      replace: true,
      transclude: true,
      scope:
      {
        onError: '&',
        onReady: '&',
        streamSrc: '=',
        placeholder: '=',
        config: '=channel'
      },
      link: function postLink($scope, element) {
        
        socket.on('srcRdy', function(src) {
          
          var videoElem = null,
              videoStream = null,
              placeholder = null;
          
          window.console.log('srcRdy begin with src:', src);
          
          $scope.config = $scope.config || {};
  
          var _removeDOMElement = function _removeDOMElement(DOMel) {
            if (DOMel) {
              angular.element(DOMel).remove();
            }
          };
          
          var onDestroy = function onDestroy() {
            if (!!videoStream && typeof videoStream.stop === 'function') {
              videoStream.stop();
            }
            if (!!videoElem) {
              delete videoElem.src;
            }
          };
          
          var onSuccess = function onSuccess(stream) {
            videoStream = stream;
            
            // Firefox supports a src object
            if (navigator.mozGetUserMedia) {
              videoElem.mozSrcObject = stream;
            } else {
              var vendorURL = window.URL || window.webkitURL;
              videoElem.src = vendorURL.createObjectURL(stream);
            }
  
            window.console.log('Src webcam stream:', videoElem.src);
            socket.emit('webcamMsg', 'Sending video initialized!');
            
            /* Start playing the video to show the stream from the webcam */
            videoElem.play();
            
            if($scope.config !== undefined){
              $scope.config.video = videoElem;
            }
            /* Call custom callback */
            if ($scope.onStream) {
              $scope.onStream({stream: stream});
            }			
          };  
                
          // called when any error happens
          var onFailure = function onFailure(err) {
            _removeDOMElement(placeholder);
            if (console && console.log) {
              console.log('The following error occured: ', err);
            }
  
            /* Call custom callback */
            if ($scope.onError) {
              $scope.onError({err:err});
            }
  
            return;
          };
  
          var startWebcam = function startWebcam() {
            videoElem = document.createElement('video');
            videoElem.setAttribute('class', 'webcam-live-receive');
            videoElem.setAttribute('autoplay', '');
            element.append(videoElem);
  
            if ($scope.placeholder) {
              placeholder = document.createElement('img');
              placeholder.setAttribute('class', 'webcam-loader');
              placeholder.src = $scope.placeholder;
              element.append(placeholder);
            }
  
            // Default variables
            var isStreaming = false,
              width = element.width = $scope.config.videoWidth || 320,
              height = element.height = 0;
  
            // Check the availability of getUserMedia across supported browsers
            if (!window.hasUserMedia()) {
              onFailure({code:-1, msg: 'Browser does not support getUserMedia.'});
              return;
            }
  
            var mediaConstraint = { video: true, audio: false };
            navigator.getMedia(mediaConstraint, onSuccess, onFailure);
  
            /* Start streaming the webcam data when the video element can play
             * It will do it only once
             */
            videoElem.addEventListener('canplay', function() {
              if (!isStreaming) {
                var scale = width / videoElem.videoWidth;
                height = (videoElem.videoHeight * scale) ||
                          $scope.config.videoHeight;
                videoElem.setAttribute('width', width);
                videoElem.setAttribute('height', height);
                isStreaming = true;
  
              if($scope.config !== undefined){
                $scope.config.video = videoElem;
              }
  
                _removeDOMElement(placeholder);
  
                /* Call custom callback */
                if ($scope.onStreaming) {
                  $scope.onStreaming();
                }
              }
            }, false);
          };
  
          var stopWebcam = function stopWebcam() {
            onDestroy();
            videoElem.remove();
          };
  
          $scope.$on('$destroy', onDestroy);
          $scope.$on('START_WEBCAM', startWebcam);
          $scope.$on('STOP_WEBCAM', stopWebcam);
          
          startWebcam();
        });     
      }
      
    };
  });
 
})();