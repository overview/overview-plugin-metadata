'use strict'

const fs = require('fs')

const AssetPipeline = require('hpd-asset-pipeline')
const PageGenerator = require('hpd-page-generator')

function loadAssetBucketAsync(callback) {
  AssetPipeline.render({
    host: 'https://example.org',
    baseHref: '',
    basePath: `${__dirname}/../assets`,
    assets: require('../config/assets'),
  }, callback)
}

function loadPagesStaticWebsiteSync(assets) {
  return PageGenerator.generate({
    baseUrl: 'https://example.org',
    baseHref: '',
    basePath: `${__dirname}/../views`,
    database: {
      metadata: { metadata: fs.readFileSync(`${__dirname}/../config/metadata.json`) },
    },
    pages: require('../config/pages'),
    globals: {
      assets: assets,
    }
  })
}

function loadStaticWebsitesAsync(callback) {
  loadAssetBucketAsync((err, assets) => {
    if (err) return callback(err)

    const pagesWebsite = loadPagesStaticWebsiteSync(assets)

    return callback(null, {
      assets: assets.toWebsite(),
      pages: pagesWebsite
    })
  })
}

module.exports = {
  loadAssetBucketAsync: loadAssetBucketAsync,
  loadPagesStaticWebsiteSync: loadPagesStaticWebsiteSync,
  loadStaticWebsitesAsync: loadStaticWebsitesAsync
}
