'use strict';

const fs = require('fs');

class FileDataSource {
  constructor(config = {}, rootPath) {
    this.config = config;
    this.root = rootPath;
  }

  /**
   * Parse [AREA] and [BUNDLE] template in the path
   * @param {string} path
   * @return {string}
   * @throws Error
   */
  resolvePath(config) {
    const { path, bundle, area } = config;

    if (!this.root) {
      throw new Error('No root configured for DataSource');
    }

    if (!path) {
      throw new Error('No path for DataSource');
    }

    if (path.includes('[AREA]') && !area) {
      throw new Error('No area configured for path with [AREA]');
    }

    if (path.includes('[BUNDLE]') && !bundle) {
      throw new Error('No bundle configured for path with [BUNDLE]');
    }

    return this.root + '/' + path
      .replace('[AREA]', area)
      .replace('[BUNDLE]', bundle)
    ;
  }
}

module.exports = FileDataSource;
