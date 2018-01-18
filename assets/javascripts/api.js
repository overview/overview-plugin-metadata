'use strict'

const escapeHtml = require('escape-html')

function runCallbacks(callbacks, value) {
  callbacks.forEach(function(callback) { callback(value) })
}

const origin = (new URL(document.location)).searchParams.get('origin')
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
  openMetadataSchemaEditor: function() { sendMessage('openMetadataSchemaEditor') },
  saveDocumentMetadata: function(documentId, metadata) {
    sendMessage('patchDocument', { id: documentId, metadata: metadata })
  }
}
