const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./bim-database-firebase-adminsdk-ciacm-dd61b4a4ff.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bim-database.firebaseio.com',
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.line = require('./lineNotify')

exports.lineRegister = functions.https.onRequest((request, response) => {
  const db = admin.database()
  const user = request.query.state.substring(10)
  console.log('uid is', user)
  console.log('data is', request.query)
  const axios = require('axios')
  const qs = require('qs')
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const searchParams = {
    code: request.query.code,

    grant_type: 'authorization_code',
    client_id: 'tKhsV6OXEqm35U9WBF9mW6',
    redirect_uri: 'https://us-central1-bim-database.cloudfunctions.net/lineRegister',
    client_secret: `k3mQC2nMIFee1tlP5H19wng6f6WYFrsLkNipt5zM8Gy`,
  }
  console.log('Param is', searchParams)
  axios
    .post('https://notify-bot.line.me/oauth/token', qs.stringify(searchParams), config)
    .then((res) => {
      console.log('res', res.data)
      db.ref(`/user/${user}`).once('value', (data) => {
        if (data.val() !== null) {
          db.ref(`/user/${user}/lineToken`).set(res.data.access_token)
        }
      })
      return true
    })
    .catch((err) => {
      console.log(err.response.data)
    })
  //
  // Endpoint: https://notify-bot.line.me/oauth/token
  //   Method: POST
  // HEADER:
  //   - Content-Type: application/x-www-form-urlencoded

  response.send(`เชื่อมต่อไลน สำเร็จแล้ว กรุณาปิดหน้านี้`)
})
