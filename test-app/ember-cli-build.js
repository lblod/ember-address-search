'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      watchDependencies: ['@lblod/ember-address-search'],
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app);
};
