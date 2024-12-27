const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const AuthenticationError = require("../exceptions/AuthenticationError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ name, password }) {
    await this.verifyNewUsername(name);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, hashedPassword],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal di tambahkan");
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(name) {
    const query = {
      text: "SELECT name FROM users WHERE name = $1",
      values: [name],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user, username sudah di gunakan"
      );
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyUserCredential(name, password) {
    const query = {
        text: "SELECT id, password FROM users WHERE name = $1",
        values: [name],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
        throw new AuthenticationError('Kresidential yang anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
        throw new AuthenticationError('Kresidential yang anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;
