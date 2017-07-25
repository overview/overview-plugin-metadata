'use strict'

const escapeHtml = require('escape-html')

function runCallbacks(callbacks, value) {
  callbacks.forEach(function(callback) { callback(value) })
}

function parseQueryString() {
  const ret = {}
  let m;

  if (m = /(^|\?|&)server=([-._a-zA-Z0-9%]*)(&|$)/.exec(window.location.search)) {
    ret.server = decodeURIComponent(m[2])
  }

  return ret
}

const origin = parseQueryString().server
const _onDocumentSetChanged = []
const _onDocumentChanged = []

function sendMessage(name, data) {
  window.parent.postMessage({ call: name, args: [ data ] }, origin)
}

function receiveMessage(ev) {
  if (ev.origin !== origin) return

  switch (ev.data.event) {
    case 'notify:documentSet':
      const documentSet = ev.data.args[0]
      runCallbacks(_onDocumentSetChanged, documentSet)
      break
    case 'notify:document':
      const document = ev.data.args[0]
      runCallbacks(_onDocumentChanged, document)
      break
    default:
      // some notification we don't care about
  }
}

window.addEventListener('message', receiveMessage)

module.exports = {
  onDocumentSetChanged: function(f) { _onDocumentSetChanged.push(f) },
  onDocumentChanged: function(f) { _onDocumentChanged.push(f) },
  requestDocumentSet: function() { sendMessage('notifyDocumentSet') },
  requestDocument: function() { sendMessage('notifyDocument') },
  saveDocumentMetadata: function(documentId, metadata) {
    sendMessage('patchDocument', { id: documentId, metadata: metadata })
  }
}
