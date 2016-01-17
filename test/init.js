'use strict';

const mongo = require('../app/lib/db');
const Mocha = require('mocha');
const mocha = new Mocha();
const fs = require('fs');
const path = require('path');
const testDir = __dirname + '/e2e';

require('../boot')
  .then(() => {
    fs
      .readdirSync(testDir)
      .filter((file) => {
        return file.substr(-3) === '.js';
      })
      .forEach((file) => {
        mocha.addFile(
          path.join(testDir, file)
        );
      });

    mocha.run((failures) => {
      process.exit(failures);
    });
  });
