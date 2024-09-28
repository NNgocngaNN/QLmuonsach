const Reader = require("../../models/reader.model");
const Book = require("../../models/book.model");
const asyncHandler = require("express-async-handler");
const generateString = require("../../helpers/generateString");

const create = asyncHandler(async (req, res) => {
  req.body.token = generateString.generateRandomString(20);
  const user = await Reader.create(req.body);
  res.status(200).json(user);
});

const getUser = asyncHandler(async (req, res) => {
  const tokenUser = req.headers.authorization.split("")[1];
  const reader = await Reader.findOne({
    token: tokenUser,
  });
  res.status(200).json({ message: "Gui nguoi doc thanh cong", reader });
});

const getAll = asyncHandler(async (req, res) => {
  const reader = await Reader.find({});
  res.status(200).json(reader);
});

module.exports = {
  create,
  getUser,
  getAll,
};
