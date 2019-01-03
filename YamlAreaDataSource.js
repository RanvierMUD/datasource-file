'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const FileDataSource = require('./FileDataSource');
const YamlDataSource = require('./YamlDataSource');

/**
 * Data source for areas stored in yml. Looks for a directory structure like:
 *
 *   path/
 *     area-one/
 *       manifest.yml
 *     area-two/
 *       manifest.yml
 *
 * Config:
 *   path: string: relative path to directory containing area folders
 *
 */
class YamlAreaDataSource extends FileDataSource {
  hasData(config = {}) {
    const dirPath = this.resolvePath(config);
    return fs.existsSync(dirPath);
  }

  async fetchAll(config = {}) {
    const dirPath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlAreaDataSource`);
    }

    return new Promise((resolve, reject) => {
      const data = {};

      fs.readdir(fs.realpathSync(dirPath), { withFileTypes: true }, async (err, files) => {
        for (const file of files) {
          if (!file.isDirectory()) {
            continue;
          }

          const manifestPath = [dirPath, file.name, 'manifest.yml'].join('/');
          if (!fs.existsSync(manifestPath)) {
            continue;
          }

          data[file.name] = await this.fetch(config, file.name);
        }

        resolve(data);
      });
    });
  }

  async fetch(config = {}, id) {
    const dirPath = this.resolvePath(config);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlAreaDataSource`);
    }

    const source = new YamlDataSource({}, dirPath);

    return source.fetchAll({ path: `${id}/manifest.yml` });
  }

  async update(config = {}, id, data) {
    const dirPath = this.resolvePath(config);
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlAreaDataSource`);
    }

    const source = new YamlDataSource({}, dirPath);

    return await source.replace({ path: `${id}/manifest.yml` }, data);
  }
}

module.exports = YamlAreaDataSource;
