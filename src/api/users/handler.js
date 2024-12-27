const fetch = require("node-fetch");
const FormData = require('form-data');
class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayLoad(request.payload);
    const { name, password } = request.payload;

    const userId = await this._service.addUser({
      name,
      password,
    });

    const response = h.response({
      status: "success",
      message: "User berhasil di tambahkan",
      data: {
        userId,
      },
    });

    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: "success",
      data: {
        user,
      },
    };
  }

  async getListEmployee(request, h) {
    const apiUrl = "http://localhost:8001/list_employee";

    async function fetchData() {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return { data };
      } catch (error) {
        return {
          status: "error",
          error: {
            code: 400,
            message: error.message,
          },
        };
      }
    }

    return await fetchData();
  }

  async postData(request, h) {
    const apiUrl = "http://localhost:8001/post_data";

    const file = request.payload.file;

    async function fetchData() {
      try {
        const formData = new FormData();
        formData.append("file", file._data, file.hapi.filename);

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return { data };
      } catch (error) {
        return {
          status: "error",
          error: {
            code: 400,
            message: error.message,
          },
        };
      }
    }

    return await fetchData();
  }
}

module.exports = UserHandler;
