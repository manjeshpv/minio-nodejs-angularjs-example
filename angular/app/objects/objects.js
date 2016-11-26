/**
 * Created by Manjesh on 26-11-2016.
 */
'use strict';

angular.module('minioApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('objects-list', {
        url: '/:name',
        templateUrl: 'app/objects/list/list.html',
        controller: 'ObjectsListCtrl',
        controllerAs: '$ctrl',
      })


    //  All Object - Routes
    //  .state('objects', {
    //    abstract: true,
    //    url: '/objects',
    //    template: '<div ui-view></div>',
    //  })
    //  .state('objects.list', {
    //    url: '/:name',
    //    templateUrl: 'app/objects/list/list.html',
    //    controller: 'ObjectsListController',
    //    controllerAs: '$ctrl',
    //  })
    //  // One Object Routes
    //  .state('object', {
    //    abstract: true,
    //    url: '/objects/:objectId',
    //    template: '<div ui-view></div>',
    //    controller: 'ObjectsCtrl',
    //    controllerAs: 'Objects',
    //    resolve:{
    //      currentObject: (QResolve, $stateParams) => QResolve.currentObject($stateParams.objectId, { fl: 'id' }),
    //    },
    //  })
    //  .state('object.view', {
    //    url: '',
    //    templateUrl: 'app/objects/view/view.html',
    //    controller: 'ObjectViewController',
    //    controllerAs: 'ObjectView',
    //    resolve:{
    //      currentObject: function (Restangular, $stateParams) {
    //        return Restangular
    //          .one('objects', $stateParams.objectId)
    //          .get()
    //          .catch(err => alert("Object Not found"));
    //      },
    //      sampleCvs: function (Restangular, $stateParams) {
    //        return Restangular
    //          .one('objects', $stateParams.objectId)
    //          .all('sampleCvs')
    //          .getList()
    //          .catch(err => alert("Object Not found"));
    //      },
    //    },
    //  })
    //  .state('object.sample-cv',{
    //    url: '/sample-cv/:sampleCvId',
    //    templateUrl: 'app/objects/sample-cv/sample-cv.html',
    //    controller: 'ObjectViewController',
    //    controllerAs: 'ObjectView',
    //    resolve: {
    //      currentObject: function (Restangular, $stateParams) {
    //        return Restangular
    //          .one('objects', $stateParams.objectId)
    //          .get({soundPath:true,metrics:true})
    //          .catch(err => alert("Object Not found"));
    //      },
    //      sampleCvs: function (Restangular, $stateParams) {
    //        return Restangular
    //          .one('objects', $stateParams.objectId)
    //          .all('sampleCvs')
    //          .getList()
    //          .catch(err => alert("Object Not found"));
    //      }
    //    }
    //  });
  });
