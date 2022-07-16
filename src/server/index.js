let path = require('path')
const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
let bodyParser = require('body-parser')
let cors = require('cors')
let textapi = {
    application_key: process.env.API_KEY
};

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('dist'))

app.get('/APIkey', function (req, res) {
    res.json(textapi);
})  

app.listen(8082, function () {
    console.log('Example app listening on port 8082!')
})
