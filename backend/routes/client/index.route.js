const bookRouter = require("./book.route");

module.exports = (app) => {
  app.use("/books", bookRouter);
};
