/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-simplewebrtc-shim',

  options: {
    nodeAssets: {
      simplewebrtc: {
        vendor: {
          srcDir: './',
          destDir: 'simplewebrtc',
          include: ['out/simplewebrtc.bundle.js']
        }
      }
    }
  },

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/simplewebrtc/out/simplewebrtc.bundle.js');
    this.import('vendor/shims/simplewebrtc.js', {
      exports: {
        simplewebrtc: [
          'default'
        ]
      }
    });
  }
};
