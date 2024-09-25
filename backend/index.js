// Khoi tao ung dung
const express = require("express");
const moment = require("moment");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

require("dotenv").config(); // Tai bien moi truong tu file .env

// Ket noi co so du lieu
const database = require("./config/database");
database.connect(); // Goi ham ket noi voi co so du lieu

// Khoi tao ung dung Express
const app = express();
const port = process.env.PORT; // Lay port tu bien moi truong

// Cau hinh middleware
app.use(cookieParser("ASDFGHJKLZXCVBNM")); // Cau hinh cookieParser voi khoa bi mat
app.use(session({ cookie: { maxAge: 60000 } })); // Cau hinh session voi thoi gian ton tai cua cookie

app.use(express.static("public")); // Cau hinh thu muc chua file tinh
app.use(methodOverride("_method")); // Su dung methodOverride de ho tro PUT va DELETE thong qua form HTML
app.use(cors()); // Cho phep chia se tai nguyen giua cac nguon

// Cau hinh router cho admin va client
const adminRoute = require("./routes/admin/index.route"); // Khai bao duong dan den router admin
const systemPrefix = require("./config/system"); // Lay prefix cua he thong

const clientRoute = require("./routes/client/index.route"); // Khai bao duong dan den router client

// Cau hinh body parser
app.use(bodyParser.urlencoded({ extended: false })); // Giai ma cac yeu cau duoc gui bang form
app.use(express.json()); // Giai ma cac yeu cau JSON

// Cau hinh duong dan den thu vien TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
); // Cau hinh thu muc chua thu vien TinyMCE

app.use(express.urlencoded({ extended: false })); // Giai ma URL-encoded requests

// Cau hinh bien cuc bo
app.locals.adminPrefix = systemPrefix.adminPrefix; // Luu prefix cua admin vao bien cuc bo
app.locals.moment = moment; // Luu bien moment de su dung trong view

// Cai dat route cho ung dung
adminRoute(app); // Cai dat route admin
clientRoute(app); // Cai dat route client

// Bat server
app.listen(port, () => {
  console.log(`Ung dung dang chay tren cong ${port}`); // Xac nhan ung dung dang chay tren cong nao
});
