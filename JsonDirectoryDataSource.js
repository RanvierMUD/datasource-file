'use strict';

const fs = require('fs');
const path = require('path');

const FileDataSource = require('./FileDataSource');
const JsonDataSource = require('./JsonDataSource');


/**
 * Data source when you have a directory of json files and each entity is stored in
 * its own json file, e.g.,
 *
 *   foo/
 *     a.json
 *     b.json
 *     c.json
 *
 * Config:
 *   path: string: relative path to directory containing .json files from project root
 *
 * @extends DataSource
 */
class JsonDirectoryDataSource extends FileDataSource {

  hasData(config = {}) {
    const filepath = this.resolvePath(config);
    return Promise.resolve(fs.existsSync(filepath));
  }

  fetchAll(config = {}) {
    const dirPath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${dirPath}] specified for JsonDirectoryDataSource`);
    }

    return new Promise((resolve, reject) => {
      const data = {};

      fs.readdir(fs.realpathSync(dirPath), async (err, files) => {
        for (const file of files) {
          if (path.extname(file) !== '.json') {
            continue;
          }

          const id = path.basename(file, '.json');
          data[id] = await this.fetch(config, id);
        }

        resolve(data);
      });
    });
  }

  fetch(config = {}, id) {
    const dirPath = this.resolvePath(config);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Invalid path [${dirPath}] specified for JsonDirectoryDataSource`);
    }

    const source = new JsonDataSource({}, dirPath);

    return source.fetchAll({ path: `${id}.json` });
  }

  async update(config = {}, id, data) {
    const dirPath = this.resolvePath(config);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Invalid path [${dirPath}] specified for JsonDirectoryDataSource`);
    }
    const source = new JsonDataSource({}, dirPath);

    return await source.replace({ path: `${id}.json` }, data);
  }
}

module.exports = JsonDirectoryDataSource;
