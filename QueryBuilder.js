module.exports = class QueryBuilder {
  #search = "";
  #query = "";
  #select = "";
  #sortByQuery = "";
  #pagination = "";
  #limitNumber = "";
  #limitQuery = "";
  #bannedParams = ["password"];

  constructor({ LIKE, EQUAL, LIMIT, PAGE, SORT }) {
    this.#search = this.#searchCriterias({ LIKE, EQUAL });
    this.#limitQuery = this.#limit(LIMIT) || "";
    this.#pagination = this.#page(PAGE) || "";
    this.#sortByQuery = this.#sortBy(SORT) || "";
  }

  #searchCriterias(criteras) {
    let res = "";
    Object.entries(criteras).map(([type, params]) => {
      Object.entries(params).map(([key, val]) => {
        if (val) {
          res += res.length ? `AND ` : `WHERE `;
          res += this.#getSearchType(type, key);
        }
      });
    });
    return res;
  }

  #sortBy({ sortBy, orderBy }) {
    if (this.#bannedParams.includes(sortBy)) return "";
    if (sortBy) {
      let order = "";
      if (orderBy) {
        order = orderBy.toUpperCase() === "ASC" ? " ASC" : " DESC";
      }
      return `ORDER BY ${sortBy} ${order} `;
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

  run() {
    this.#query += this.#select;
    this.#query += this.#search;
    this.#query += this.#sortByQuery;
    this.#query += this.#limitQuery;
    this.#query += this.#pagination;
    return this.#query;
  }

  #getSearchType = (type, val) => {
    switch (type) {
      case "LIKE":
        return `${val} LIKE ( '%' || $${val} || '%') `;
      case "EQUAL":
        return `${val} = $${val} `;
    }
  };
};
