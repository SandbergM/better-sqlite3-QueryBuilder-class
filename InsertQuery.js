const sqlite3 = require("better-sqlite3");
const db = sqlite3(/*DB PATH*/);

module.exports = class InsertQuery {
  #insert = "";
  #fields = "";
  #params = {};

  constructor({ TABLE, ENTITY }) {
    this.#insert = ` INSERT INTO ${TABLE} `;
    this.#params = ENTITY;
    this.#fields = ` (${Object.keys(ENTITY)}) VALUES (${Object.keys(ENTITY).map(
      (x) => "$" + x
    )})`;
  }

  run() {
    let query = "";
    query += this.#insert;
    query += this.#fields;
    return db.prepare(query).run({ ...this.#params });
  }
};
