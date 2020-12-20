# better-sqlite3-QueryTemplate

<p>Very basic class i made to mimic MongoTemplate, but for better-sqlite3 - To generate dynamic queries with pagination and sorting</p>

<h2> Create a query by selecting what table you are using and what type of data it has, Example - </h2>
<p> let query = new QueryBuilder({ table: "users", dataType: new User({}) }) </p>

<h2> Deconstruct your req.query och req.params </h2>

<p>const { username, id, email, firstName, lastName } = req.query;</p>
<p>const { page, sortBy, orderBy } = req.query;</p>
  
<h2> Implement what type of search you want </h2>

<h2> Condition : LIKE </h2>
<p> query.addCritera({ type: "LIKE", params: { firstName, lastName, username } }); </p>

<h2> Condition : Equals / = </h2>
<p> query.addCritera({ type: "EQUAL", params: { id, email } }); </p>

<h2> Pagination / Limit / Sort / Order </h2>

<p>query.sortBy({ sortBy: sortBy, orderBy: orderBy });</p>
<p>query.limit({ limit: 100 });</p>
<p>query.page({ page: page });</p>

<h2> Run the query </h2>
<p> let statement = db.prepare(query.run()); </p>
