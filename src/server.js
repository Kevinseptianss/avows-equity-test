const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const auth = require("./api/auth");
const users = require("./api/users");
const AuthService = require("./services/AuthService");
const ClientError = require("./exceptions/ClientError");
const UsersService = require("./services/UsersService");
const AuthenticationsValidator = require("./validator/auth");
const UserValidator = require("./validator/users");
const TokenManager = require("./tokenize/TokenManager");

require("dotenv").config();

const init = async () => {
  const usersService = new UsersService();
  const authService = new AuthService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("avows_equity", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register([
    {
      plugin: auth,
      options: {
        auth: authService,
        users: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
  ]);

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
