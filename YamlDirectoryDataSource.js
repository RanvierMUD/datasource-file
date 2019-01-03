'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const FileDataSource = require('./FileDataSource');
const YamlDataSource = require('./YamlDataSource');

/**
 * Data source when you have a directory of yaml files and each entity is stored in
 * its own yaml file, e.g.,
 *
 *   foo/
 *     a.yml
 *     b.yml
 *     c.yml
 *
 * Config:
 *   path: string: relative path to directory containing .yml files from project root
 *
 */
class YamlDirectoryDataSource extends FileDataSource {

  hasData(config = {}) {
    const filepath = this.resolvePath(config);
    return Promise.resolve(fs.existsSync(filepath));
  }

  async fetchAll(config = {}) {
    const dirPath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlDirectoryDataSource`);
    }

    return new Promise((resolve, reject) => {
      const data = {};

      fs.readdir(dirPath, async (err, files) => {
        for (const file of files) {
          if (path.extname(file) !== '.yml') {
            continue;
          }

          const id = path.basename(file, '.yml');
          data[id] = await this.fetch(config, id);
        }

        resolve(data);
      });
    });
  }

  async fetch(config = {}, id) {
    const dirPath = this.resolvePath(config);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlDirectoryDataSource`);
    }

    const source = new YamlDataSource({}, dirPath);

    return source.fetchAll({ path: `${id}.yml` });
  }

  async update(config = {}, id, data) {
    const dirPath = this.resolvePath(config);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlDirectoryDataSource`);
    }

    const source = new YamlDataSource({}, dirPath);

    return await source.replace({ path: `${id}.yml` }, data);
  }
}

module.exports = YamlDirectoryDataSource;
