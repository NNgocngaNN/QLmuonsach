const bookRouter = require("./book.route");
const readerRoutes = require("./reader.route");

const controllerReader = require("../../controllers/client/reader.controller");

module.exports = (app) => {
  app.use("/books", bookRouter),
    app.post("/reader/register", controllerReader.create),
    app.use("/reader", readerRoutes);
};
