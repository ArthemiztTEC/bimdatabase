const functions = require('firebase-functions')
const _ = require('lodash')
const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const LineNotify = require('./src/client')

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

// build multiple CRUD interfaces:
app.post('/', async (request, response) => {
  const {
    token,
    datamodel,
    issue: { label = '', description = '', priority = 0 },
    imagesUrl = [],
  } = request.body
  const lineNotify = require('line-notify-nodejs')(token)
  const prices = _.get(request, 'body.issue.priceList', [])
  console.log('Images', imagesUrl)
  let sum = _.reduce(
    prices,
    (acc, n) => {
      return acc + Number(n.price)
    },
    0
  )
  let level = 'ปกติ'
  if (priority === 1) {
    level = 'ปกติ'
  } else if (priority === 2) {
    level = 'มาก'
  } else {
    level = 'ด่วนที่สุด'
  }
  const ACCESS_TOKEN = token
  const notify = new LineNotify(`${ACCESS_TOKEN}`)
  await notify.sendText(
    `คุณมีการแจ้งซ่อม ${level} ที่โครงการ ${datamodel.projectName} เรื่อง ${label} รายละเอียด ${description} ราคาประเมิน ${sum}`
  )

  _.forEach(imagesUrl, (item) => {
    console.log('Send Image', item)
    notify.sendImage(item)
  })

  response.send(request.body)
  // lineNotify
  //   .notify({
  //     message: ,
  //     imageFile: imagesUrl,
  //   })
  //   .then((res) => {
  //
  //     response.send(request.body)
  //     return true
  //   })
  //   .catch((e) => {
  //     console.log(e)
  //   })
  return true
})

exports.lineNotify = functions.https.onRequest(app)
