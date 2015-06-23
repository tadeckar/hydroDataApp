angular.module('hydroDataAppModule').
controller('viewImagesController', ['$scope', '$location', '$window', '$document', '$timeout', '$http', '$rootScope', 'Upload',  function($scope, $location, $window, $document, $timeout, $http, $rootScope, Upload) {

    $scope.images = [];
    $scope.albums = [];
    $scope.viewingAlbum = false;
    $scope.viewingMovie = false;

    var loadedImages = [];

    $scope.getImageAlbums = function () {
        $http.get('/getAlbumList').success(function (data) {
            $scope.albums = data;
        }).error(function (error) {
            console.log(error);
        });
    }

    $scope.getImageData = function (albumId, albumName) {
        $http.get('/getImageData/' + albumId).success(function (data) {
            $scope.images = data;
            $scope.viewingAlbum = true;
            $scope.thisAlbum = albumName;
            $scope.thisAlbumId = albumId;
        }).error(function (error) {
            console.log(error);
        });
    };

    $scope.createMovie = function (i) {
        if (typeof i === 'undefined') {
            $scope.images.forEach(function (val,i,array) {
                var img = new Image();
                img.src = 'uploads/' + val.fileName;
                loadedImages.push(img);
            });
        }
        var index = i < $scope.images.length - 1 ? i+1 || 1 : 0;
        $scope.movieIndex = index;
        if ($scope.viewingMovie) {
            $timeout($scope.createMovie, 600, true, index);
        }
    };

    $scope.addNewAlbum = function () {
        var data = {
            'albumName': $scope.newAlbumNameInput
        };
        $http.post('/addAlbum', data).success(function (data) {
            $scope.getImageAlbums();
            $scope.isAddAlbumDropdownOpen = false;
            $scope.newAlbumNameInput = "";

        }).error(function (error){
            console.log(error);
        });
    }

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/uploadImage/' + $scope.thisAlbumId,
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $scope.getImageData($scope.thisAlbumId, $scope.thisAlbum);
                });
            }
        }
    };

    $scope.deleteAlbum = function () {
        var proceed = confirm("Are you sure you want to delete this album?");
        if (!proceed) { return };
        $http.post('/deleteAlbum/' + $scope.thisAlbumId).success(function (data) {
            $scope.getImageAlbums();
            $scope.viewingAlbum = false;
            $scope.viewingMovie = false;
        }).error(function (error) {
            console.log(error);
        });
    };

    $scope.deleteImage = function (id, filename) {
        var proceed = confirm("Are you sure you want to delete this image?");
        if (!proceed) { return };
        var data = { 'id' : id, 'filename' : filename};
        $http.post('/deleteImage', data).success(function (data) {
            $scope.getImageData($scope.thisAlbumId, $scope.thisAlbum);
        }).error(function (error) {
            console.log(error);
        });
    };

}]);
