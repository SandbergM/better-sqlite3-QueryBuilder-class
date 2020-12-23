Very basic class i made to mimic MongoTemplate, but for better-sqlite3 - To generate dynamic queries with pagination and sorting

EXAMPLE
```
const userSearch = ({ username, email, id, page, sortBy, orderBy }) => {
  let query = new SearchQuery({
    LIKE: { username },
    EQUAL: { email, id },
    LIMIT: 100,
    PAGE: { page },
    SORT: { sortBy, orderBy },
  });

  let statement = db.prepare(` SELECT * FROM users ${query.run()} `);
  let users = statement.all({ username, email, id, page });

  return users;
};
```

Result 
```
"SELECT * FROM users 
WHERE username LIKE ( '%' || $username || '%') 
AND id = $id 
ORDER BY createdOn  DESC 
LIMIT 100 OFFSET 0"
```
