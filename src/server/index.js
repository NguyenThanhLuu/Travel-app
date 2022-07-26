let path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
let bodyParser = require("body-parser");
let cors = require("cors");
let apiInfo = {
    application_key_weather: process.env.API_KEY_TAKE_WEATHER,
    application_key_image: process.env.API_KEY_TAKE_iMAGE,
};

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("dist"));

app.get("/APIkey", (req, res) => {
  res.json(apiInfo);
});

app.listen(8082, () => {
    console.log("Server is running on port 8082!");
});
