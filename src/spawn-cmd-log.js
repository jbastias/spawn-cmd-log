import { spawn } from 'child_process';
import fs from 'fs';
import createDebug from 'debug';

const debug = createDebug('IMPORT_SRV:RUN_TASK');

export default function spawnCmd(cmd, logfile) {
  debug(`runTask(cmd, logfile)`);

  const log = fs.createWriteStream(logfile, { flags: 'a' });

  log.write(`command: ${cmd}\n`);

  const start = +new Date();
  const args = cmd.split(' ');
  const program = args.shift();

  const proc = spawn(program, args.filter(item => item !== ''), { detached: false });

  return new Promise((resolve, reject) => {

    proc.on('error', function (err) {
      debug(`child process got an error: ${err}`);
      log.werite(`ERROR: ${err}`);
      reject(err);
    })

    proc.on('close', (code, signal) => {
      const status = code === 0 ? 'SUCCESS' : 'ERROR';
      debug(`child process exited with code: ${code} and status: ${status}`);
      log.write(`child process (${program}) exited with code: ${code} and status: ${status}\n`);

      const end = +new Date();
      log.end(`duration: ${(end - start) / 1000} sec\n`);

      if (status === 'ERROR') {
        reject(status);
      }
      resolve(status);
    });

    proc.stdout.on('data', (data) => {
      log.write(`${data.toString('utf8')}\n`);
    });

    proc.stderr.on('data', (data) => {
      log.write(`ERROR: ${data.toString('utf8')}\n`);
    });
  });
}
