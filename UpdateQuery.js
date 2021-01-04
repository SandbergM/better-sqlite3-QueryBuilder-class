const sqlite3 = require("better-sqlite3");
const db = sqlite3(/*DB PATH*/);

module.exports = class InsertQuery {
  #query = "";
  #updates = false;
  #conditions = false;
  #params = {};

  constructor({ TABLE, PARAMS, ID }) {
    console.log({ TABLE, PARAMS, ID });
    this.#query = `UPDATE ${TABLE} SET `;
    this.#params = PARAMS;
    this.#updates = this.#generateUpdates(PARAMS);
    this.#conditions = ` WHERE id = ${ID}`;
  }

  #generateUpdates(params) {
    let res = "";
    Object.entries(params).forEach(([key, val]) => {
      if (val) {
        res += ` ${key} = $${key} ,`;
      }
    });
    return res.slice(0, -1);
  }

  run() {
    if (this.#updates && this.#conditions) {
      this.#query += this.#updates;
      this.#query += this.#conditions;
      return db.prepare(this.#query).run({ ...this.#params });
    }
    return false;
  }
};
