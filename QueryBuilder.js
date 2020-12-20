module.exports = class QueryBuilder {
  static #search = false;
  static #select = false;
  static #sortBy = false;
  static #pagination = false;
  static #limitNumber = false;
  static #limitQuery = false;

  constructor(table) {
    QueryBuilder.#select = ` SELECT * FROM ${table.table} `;
  }

  addCritera(critera) {
    const { type, params } = critera;
    Object.entries(params).map(([key, val]) => {
      if (val) {
        QueryBuilder.#search += QueryBuilder.#search ? " AND " : " WHERE ";
        QueryBuilder.#search += this.#getSearchType(type, key);
      }
    });
  }

  sortBy(sort) {
    const { sortBy, orderBy } = sort;
    if (sortBy) {
      let order = orderBy.toUpperCase() === "ASC" ? "ASC" : "DESC";
      QueryBuilder.#sortBy = ` ORDER BY ${sortBy} ${order} `;
    }
  }

  limit(maxLimit) {
    const { limit } = maxLimit;
    if (limit) {
      QueryBuilder.#limitNumber = limit;
      QueryBuilder.#limitQuery = ` LIMIT ${limit} `;
    }
  }

  page(currentPage) {
    const { page } = currentPage;
    if (page) {
      QueryBuilder.#pagination = ` OFFSET ${
        QueryBuilder.#limitNumber * (page - 1)
      } `;
    }
  }

  run() {
    let assembledQuery = "";
    assembledQuery += QueryBuilder.#select ? QueryBuilder.#select : "";
    assembledQuery += QueryBuilder.#search ? QueryBuilder.#search : "";
    assembledQuery += QueryBuilder.#sortBy ? QueryBuilder.#sortBy : "";
    assembledQuery += QueryBuilder.#limitQuery ? QueryBuilder.#limitQuery : "";
    assembledQuery += QueryBuilder.#pagination ? QueryBuilder.#pagination : "";
    return assembledQuery;
  }

  #getSearchType = (type, val) => {
    switch (type) {
      case "LIKE":
        return ` ${val} LIKE ( '%' || $${val} || '%') `;
      case "EQUAL":
        return ` ${val} = $${val} `;
    }
  };
};
