import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'test-app/config/environment';
import { mockRequestsWorker } from 'test-app/mocks/worker';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

mockRequestsWorker.start();
loadInitializers(App, config.modulePrefix);
