Very basic class i made to mimic MongoTemplate, but for better-sqlite3, to generate dynamic queries with pagination and sorting

Example
```
const userSearch = ({ username, email, id, page, sortBy, orderBy }) => {
  const { username, email, id, page, sortBy, orderBy } = params;
  let users = new SearchQuery({
    TABLE: "users",
    LIKE: { username },
    EQUAL: { email, id },
    LIMIT: 100,
    PAGE: { page },
    SORT: { sortBy, orderBy },
  }).run();

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
