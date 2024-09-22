const express = require("express");
const moment = require("moment");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

//Ket noi co so du lieu
const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

app.use(cors());

const adminRoute = require("./routes/admin/index.route");
const systemPrefix = require('./config/system')

//parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.locals.adminPrefix = systemPrefix.adminPrefix
app.locals.moment = moment

//route
adminRoute(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
