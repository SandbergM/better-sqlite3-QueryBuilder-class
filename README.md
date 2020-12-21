# better-sqlite3-QueryTemplate

Very basic class i made to mimic MongoTemplate, but for better-sqlite3 - To generate dynamic queries with pagination and sorting

Create a query by selecting what table you are using and what type of data it has, Example -
let query = new QueryBuilder({ table: "users", dataType: new User({}) })

Deconstruct your req.query och req.params

const { username, id, email, firstName, lastName } = req.query;
const { page, sortBy, orderBy } = req.query;

Implement what type of search you want

Condition : LIKE
query.addCritera({ type: "LIKE", params: { firstName, lastName, username } });

Condition : Equals / =
query.addCritera({ type: "EQUAL", params: { id, email } });

Pagination / Limit / Sort / Order

query.sortBy({ sortBy: sortBy, orderBy: orderBy });
query.limit({ limit: 100 });
query.page({ page: page });

Run the query
let statement = db.prepare(query.run());
