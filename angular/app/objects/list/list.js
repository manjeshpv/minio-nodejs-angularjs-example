/**
 * Created by Manjesh on 26-11-2016.
 */

angular.module("minioApp")
  .controller("ObjectsListCtrl", function($scope, $http, $sce, $stateParams, Upload) {
    var vm = this;
    vm.$stateParams = $stateParams

    vm.$sce = $sce;

    $http
      .get('api/listObjects', { params: { name: $stateParams.name }})
      .then(function(response){
        vm.objects = response.data;
      });

    vm.view = function(object){
      vm.viewUrl = '/api/presignedGetObject?bucket='+ $stateParams.name +'&object=' + object.name;
    }

    vm.downloadUrl = function(object){
      return '/api/presignedGetObject?download=true&bucket='+ $stateParams.name +'&object=' + object.name;
    }

    vm.upload = function(file){
      return $http
        .get('/api/presignedPutObject?bucket='+ $stateParams.name +'&object=' + file.name)
        .then(function(response){
          return Upload.upload({
            method: 'PUT',
            url: response.data,
            data: {
              file: file,
            },
          }).then(function (response) {
              vm.objects.push({
                name: file.name,
                lastModified: new Date(),
                size: file.size,
              })
            vm.file = {}
              return console.log('s',response);
          }, function (err) {
            return console.log('e',err);
            // return b.status > 0 ? vm.errorMsg = b.status + ": " + b.data : void 0
          }, function (progress) {
            // used for progressbar
            return vm.progress = Math.min(100, parseInt(100 * progress.loaded / progress.total));
          })
        })
    }
});