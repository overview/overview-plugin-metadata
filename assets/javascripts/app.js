'use strict'

const MetadataView = require('./view')
const api = require('./api')
const el = document.getElementById('app')

new MetadataView(el, api)
