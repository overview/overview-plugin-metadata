'use strict'

const escapeHtml = require('escape-html')

const api = require('./api')

const el = document.getElementById('app')

let metadataSchema = { "version": 1, "fields": [] }
let metadata = {}
let documentId = null

function buildFieldHtml(field, documentValue) {
  return [
    `<tr data-field-name="${escapeHtml(field.name)}">`,
    `<th><div class="field-name">${escapeHtml(field.name)}</div></th>`,
    `<td><input class="field-value" value="${escapeHtml(documentValue)}"></td>`,
    '</tr>',
  ].join('')
}

function buildHtml() {
  return [
    '<p class="if-no-document">Open a document to edit its metadata</p>',
    '<table>',
    metadataSchema.fields.map(field => buildFieldHtml(field, metadata && metadata[field.name] || '')).join(''),
    '</table>',
  ].join('')
}

function updateHtml() {
  el.classList.toggle('no-document', !documentId)
  const trs = Array.prototype.slice.apply(el.querySelectorAll('tr[data-field-name]'))
  for (const tr of trs) {
    const fieldName = tr.getAttribute('data-field-name')
    const input = tr.querySelector('input')
    if (input) {
      const value = metadata && metadata[fieldName] || ''
      input.value = value
    }
  }
}

function onDocumentSetChanged(documentSet) {
  metadataSchema = documentSet.metadataSchema
  el.innerHTML = buildHtml()
}

function onDocumentChanged(document) {
  documentId = document ? document.id : null
  metadata = document ? document.metadata : {}
  updateHtml()
}

api.onDocumentSetChanged(onDocumentSetChanged)
api.onDocumentChanged(onDocumentChanged)
api.requestDocumentSet()
api.requestDocument()

function ignoreSubmit(ev) {
  ev.preventDefault()
}

function saveNewMetadata(ev) {
  const newValues = {}
  const trs = Array.prototype.slice.apply(el.querySelectorAll('tr[data-field-name]'))
  for (const tr of trs) {
    const fieldName = tr.getAttribute('data-field-name')
    const input = tr.querySelector('input')
    if (input) {
      newValues[fieldName] = input.value
    }
  }

  // We'll only update the parts of the metadata JSON that the user sees. Other
  // JSON values that aren't part of the schema won't be changed.
  Object.assign(metadata, newValues)
  api.saveDocumentMetadata(documentId, metadata)
}

document.addEventListener('submit', ignoreSubmit)
document.addEventListener('change', saveNewMetadata)
