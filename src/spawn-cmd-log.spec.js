import { expect } from 'chai';
import fs from 'mz/fs';
import spawnCmd from './spawn-cmd-log';

describe('spawnCmd', () => {

  it('run ls', (done) => {
    spawnCmd(`ls -l ${process.env.HOME}`, './ls.log').then(status => { 
      expect(status).to.be.equal('SUCCESS');
      return fs.readFile('./ls.log', 'utf8')
        .then(data => expect(data).to.be.not.empty)
        .then(() => fs.unlink('./ls.log'))
        .then(() => done());
    }).catch(err => {
      console.log(err);
      done();
    });
  });

});

