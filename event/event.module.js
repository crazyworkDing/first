(function () {
  'use strict';

  angular.module('OpenApiPlat.modules.behavior.event', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider  
        .state('behavior.event', {
          title: '事件分析',
          url: '/event',
          templateUrl: 'app/modules/behavior/event/event.html',
          controller: 'EventController',
          sidebarMeta: {
            icon: 'fa fa-bar-chart',
            order: 50,
            permissionOnly: "modules.behavior.event"
          }
        }) 
        // .state('behavior.SmGroup-create', {
        //   url: '/SmGroup-create',
        //   templateUrl: 'app/modules/behavior/SmGroup/detail/create.html'
        // })
        // .state('behavior.SmGroup-change', {
        //   url: '/SmGroup/:group/edit',
        //   templateUrl: 'app/modules/behavior/SmGroup/detail/edit.html'
        // });                   
  }
})();

