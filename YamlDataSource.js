'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

const FileDataSource = require('./FileDataSource');

/**
 * Data source when you have all entities in a single yaml file
 *
 * Config:
 *   path: string: relative path to .yml file from project root
 */
class YamlDataSource extends FileDataSource {

  hasData(config = {}) {
    const filepath = this.resolvePath(config);
    return Promise.resolve(fs.existsSync(filepath));
  }

  fetchAll(config = {}) {
    const filepath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${filepath}] for YamlDataSource`);
    }


    return new Promise((resolve, reject) => {
      const contents = fs.readFileSync(fs.realpathSync(filepath)).toString('utf8');

      resolve(yaml.load(contents));
    });
  }


  async fetch(config = {}, id) {
    const data = await this.fetchAll(config);

    const fetchSingleItem = data.find(item => item.id === id);

    if (!fetchSingleItem) {
      throw new ReferenceError(`Record with id [${id}] not found.`);
    }

    return fetchSingleItem;
}

  replace(config = {}, data) {
    const filepath = this.resolvePath(config);
    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, yaml.dump(data), err => {
        if (err) {
          return reject(err);
        }

        resolve();
      })
    })
  }

  async update(config = {}, id, data) {
    const currentData = await this.fetchAll(config);

    const fetchIndex = currentData.findIndex(item => item.id === id);

    if(fetchIndex === -1) {
      throw new ReferenceError(`Record with id [${id}] not found.`);
    }

    currentData[fetchIndex] = data;

    return this.replace(config, currentData);
  }
}

module.exports = YamlDataSource;
