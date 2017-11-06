#!/usr/bin/env node

const express = require('express')
const fs = require('fs')
const StaticWebsite = require('in-memory-website').StaticWebsite
const ExpressApp = require('in-memory-website').ExpressApp

const websiteData = fs.readFileSync(`${__dirname}/in-memory-website.data`)
const website = StaticWebsite.fromBuffer(websiteData)

const app = express()
app.use(ExpressApp(website))

app.listen(80, () => {
  console.log("Running on http://localhost...")
})
