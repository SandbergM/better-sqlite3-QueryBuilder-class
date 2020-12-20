module.exports = class QueryBuilder {
  #search = false;
  #select = false;
  #sortBy = false;
  #pagination = false;
  #limitNumber = false;
  #limitQuery = false;
  #allowedParams = [];

  constructor({ table, dataType }) {
    this.#select = ` SELECT * FROM ${table} `;
    this.#allowedParams = Object.keys(dataType);
  }

  addCritera(critera) {
    const { type, params } = critera;
    Object.entries(params).map(([key, val]) => {
      if (val) {
        this.#search += this.#search ? " AND" : " WHERE";
        this.#search += this.#getSearchType(type, key);
      }
    });
  }

  sortBy(sort) {
    const { sortBy, orderBy } = sort;
    if (sortBy && this.#allowedParams.includes(sortBy)) {
      let order = "";
      if (orderBy) {
        order = orderBy.toUpperCase() === "ASC" ? " ASC" : " DESC";
      }
      this.#sortBy = ` ORDER BY ${sortBy} ${order}`;
    }
  }

  limit(maxLimit) {
    const { limit } = maxLimit;
    if (limit) {
      this.#limitNumber = limit;
      this.#limitQuery = ` LIMIT ${limit}`;
    }
  }

  page(currentPage) {
    const { page } = currentPage;
    if (page) {
      this.#pagination = ` OFFSET ${(this.#limitNumber || 0) * (page - 1)}`;
    }
  }

  run() {
    let assembledQuery = "";
    assembledQuery += this.#select ? this.#select : "";
    assembledQuery += this.#search ? this.#search : "";
    assembledQuery += this.#sortBy ? this.#sortBy : "";
    assembledQuery += this.#limitQuery ? this.#limitQuery : "";
    assembledQuery += this.#pagination ? this.#pagination : "";
    return assembledQuery;
  }

  #getSearchType = (type, val) => {
    switch (type) {
      case "LIKE":
        return ` ${val} LIKE ( '%' || $${val} || '%')`;
      case "EQUAL":
        return ` ${val} = $${val}`;
    }
  };
};
