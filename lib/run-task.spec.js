'use strict';

var _chai = require('chai');

var _runTask = require('./run-task');

var _runTask2 = _interopRequireDefault(_runTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('runTask', function () {

  it('run ls', function (done) {
    (0, _runTask2.default)('ls -l /Users/jbastias', './ls.log').then(function (status) {
      (0, _chai.expect)(status).to.be.equal('SUCCESS');
      done();
    }).catch(function (err) {
      console.log(err);
      done();
    });
  });
});