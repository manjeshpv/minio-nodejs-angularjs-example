
angular.module("minioApp")
  .controller("AppCtrl", function($scope, $http, $sce, $stateParams) {
    var vm = this;

    vm.$stateParams = $stateParams;

    vm.buckets = [];

    vm.createBucket = function(bucketName){
      $http.post('api/makeBucket', {  name: bucketName })
        .then(function(response){
          vm.buckets.push({
            name: bucketName,
            creationDate: new Date()
          })
      })
    };

    $http.get('api/listBuckets')
      .then(function(response){
        vm.buckets = response.data;
      })
  });
