const { trace } = require("@opentelemetry/api");
class UsersHandler {
  constructor(service) {
    this._service = service;

    this.getUsersHandler = this.getUsersHandler.bind(this);
  }

  async getUsersHandler(request, h) {
    const span = trace.getTracer("default").startSpan("collectLogs");
    request.log(["info"], "Collecting logs for this request");
    span.end();
    const users = await this._service.getUsers();

    const response = h.response({
      status: "success",
      message: "Getting all users",
      data: users,
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
