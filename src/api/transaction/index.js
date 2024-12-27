const TransactionHandler = require("./handler");
const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "transaction",
  version: "1.0.0",
  register: async (server, { service, users }) => {
    const transactionHandler = new TransactionHandler(service, users);
    server.route(routes(transactionHandler));
  },
};