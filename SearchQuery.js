const sqlite3 = require("better-sqlite3");
const db = sqlite3(/*DB PATH*/);

module.exports = class SearchQuery {
  #query = "";
  #limitNumber = "";
  #bannedParams = ["password"];
  #params = {};

  constructor({ TABLE, LIKE, EQUAL, LIMIT, PAGE, SORT }) {
    this.#query += `SELECT * FROM ${TABLE.split(",")} `;
    this.#query += this.#searchCriterias({ LIKE, EQUAL });
    this.#query += this.#limit(LIMIT || false) || "";
    this.#query += this.#page(PAGE || false) || "";
    this.#query += this.#sortBy(SORT || false) || "";
    this.#params = { ...LIKE, ...EQUAL, ...LIMIT, ...PAGE, ...SORT };
  }

  #searchCriterias(criteras) {
    let res = "";
    Object.entries(criteras).map(([type, params]) => {
      if (params) {
        Object.entries(params).map(([key, val]) => {
          if (val) {
            res += res.length ? `AND ` : `WHERE `;
            res += this.#getSearchType(type, key);
          }
        });
      }
    });
    return res;
  }

  #sortBy({ sortBy, orderBy }) {
    if (this.#bannedParams.includes(sortBy)) return "";
    if (sortBy) {
      if (!orderBy) {
        orderBy = "ASC";
      } else {
        orderBy = orderBy.toUpperCase() === "ASC" ? " ASC" : " DESC";
      }
      return `ORDER BY ${sortBy} ${orderBy} `;
    }
  }

  #limit(limit) {
    if (limit) {
      this.#limitNumber = limit;
      return `LIMIT ${limit} `;
    }
  }

  #page({ page }) {
    if (page) {
      return `OFFSET ${(this.#limitNumber || 0) * (page - 1)} `;
    }
  }

  #getSearchType = (type, val) => {
    switch (type) {
      case "LIKE":
        return `${val} LIKE ( '%' || $${val} || '%') `;
      case "EQUAL":
        return `${val} = $${val} `;
    }
  };

  run() {
    return db.prepare(this.#query).all({ ...this.#params });
  }
};
