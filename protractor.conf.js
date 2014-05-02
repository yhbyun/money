exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    //'browserName': 'chrome',
    'browserName': 'firefox'
  },

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://192.168.33.21.xip.io:' + (process.env.HTTP_PORT || '9000'),

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  suites: {
    controllers: 'test/client/e2e/controllers/*.js'
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
};