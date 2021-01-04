const sqlite3 = require("better-sqlite3");
const db = sqlite3(/*DB PATH*/);

module.exports = class DeleteQuery {
  #query = "";
  #params = {};

  constructor({ TABLE, ENTITY }) {
    this.#query += ` DELETE FROM ${TABLE} `;
    this.#query += this.#conditions(ENTITY);
    this.#params = { ...ENTITY };
  }

  #conditions(params) {
    let res = "";
    if (params) {
      Object.entries(params).map(([key, val]) => {
        if (val) {
          res += res.length ? `AND ` : `WHERE `;
          res += ` ${key} = $${key} `;
        }
      });
    }
    return res;
  }

  run() {
    if (Object.keys(this.#params).length) {
      return db.prepare(this.#query).run({ ...this.#params });
    }
    return false;
  }
};
