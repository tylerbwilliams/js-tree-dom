
const unitTests = [ ];

//const unitTests = require('fs').readdirSync('./unit');
// Learn more about configuring this file at <https://theintern.github.io/intern/#configuration>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites
define({
  // Non-functional test suite(s) to run in each browser
  suites: unitTests,

  reporters: [
    { id: 'Pretty' }
  ],

  // A regular expression matching URLs to files that should not be included in code coverage analysis
  excludeInstrumentation: /^(?:tests|node_modules)\//
});
