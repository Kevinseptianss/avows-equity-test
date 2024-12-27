const { NodeTracerProvider } = require('@opentelemetry/node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const users = require("./api/users");
const UsersServices = require("./services/UsersService");
const ClientError = require("./exceptions/ClientError");
const transaction = require("./api/transaction");
const TransactionService = require("./services/TransactionService");

require("dotenv").config();

const provider = new NodeTracerProvider();
const jaegerExporter = new JaegerExporter({
  serviceName: 'avows-equity-api',
});
provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
provider.register();
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [],
});

const init = async () => {
  const usersService = new UsersServices();
  const transactionService = new TransactionService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
    debug: { request: ['error', 'info'] }
  });

  await server.register([
    {
      plugin: Inert,
    },
  ]);

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
      },
    },
    {
      plugin: transaction,
      options: {
        service: transactionService,
        users: usersService,
      },
    },
  ]);

  server.route({
    method: "GET",
    path: "/api/collect",
    options: {
      log: { collect: true }, 
    },
    handler: (request, h) => {
      request.log(["info"], "Collecting logs for this request");
      return { message: "Logs collected!" };
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
