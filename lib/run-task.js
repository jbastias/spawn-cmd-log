'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runTask;

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('IMPORT_SRV:RUN_TASK');

function runTask(cmd, logfile) {
  debug('runTask(cmd, logfile)');

  var log = _fs2.default.createWriteStream(logfile, { flags: 'a' });

  log.write('command: ' + cmd + '\n');

  var start = +new Date();
  var args = cmd.split(' ');
  var program = args.shift();

  var proc = (0, _child_process.spawn)(program, args.filter(function (item) {
    return item !== '';
  }), { detached: false });

  return new Promise(function (resolve, reject) {

    proc.on('error', function (err) {
      debug('child process got an error: ' + err);
      log.werite('ERROR: ' + err);
      reject(err);
    });

    proc.on('close', function (code, signal) {
      var status = code === 0 ? 'SUCCESS' : 'ERROR';
      debug('child process exited with code: ' + code + ' and status: ' + status);
      log.write('child process (' + program + ') exited with code: ' + code + ' and status: ' + status + '\n');

      var end = +new Date();
      log.end('duration: ' + (end - start) / 1000 + ' sec\n');

      if (status === 'ERROR') {
        reject(status);
      }
      resolve(status);
    });

    proc.stdout.on('data', function (data) {
      log.write(data.toString('utf8') + '\n');
    });

    proc.stderr.on('data', function (data) {
      log.write('ERROR: ' + data.toString('utf8') + '\n');
    });
  });
}