import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name:'welcome', moduleId: './vvm/welcome/welcome', nav: true, title: 'Welcome' },
      { route: 'sample-list/list', name: 'sampleList', moduleId: './vvm/list/sample-list', nav: true, title: 'List' },
      { route: 'sample-list/edit/:id', name: 'itemEdit', moduleId: './vvm/list/item-edit' }
    ]);

    this.router = router;
  }
}
