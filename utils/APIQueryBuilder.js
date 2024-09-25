const { Op } = require("sequelize");

class APIQueryBuilder {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach((el) => delete queryObj[el]);

    const operatorsMap = {
      gt: Op.gt,
      gte: Op.gte,
      lt: Op.lt,
      lte: Op.lte,
      ne: Op.ne,
    };
    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") {
        Object.keys(queryObj[key]).forEach((opKey) => {
          if (operatorsMap[opKey]) {
            queryObj[key] = { [operatorsMap[opKey]]: queryObj[key][opKey] };
          }
        });
      }
    });

    this.query.where = { ...this.query.where, ...queryObj };
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort;
    let order = [];

    if (sortBy) {
      const sortFields = sortBy.split(",");
      order = sortFields.map((field) => {
        if (field.startsWith("-")) {
          return [field.slice(1), "DESC"];
        }
        return [field, "ASC"];
      });
    }

    this.query.order = order;
    return this;
  }

  limitFields() {
    const fields = this.queryString.fields;
    const selectedFields = fields ? fields.split(",") : null;

    this.query.attributes = selectedFields;
    return this;
  }

  paginate() {
    const limit = this.queryString.limit
      ? parseInt(this.queryString.limit)
      : 10;
    const page = this.queryString.page ? parseInt(this.queryString.page) : 1;
    const offset = (page - 1) * limit;

    this.query.limit = limit;
    this.query.offset = offset;
    this.query.page = page;
    return this;
  }
}

module.exports = APIQueryBuilder;