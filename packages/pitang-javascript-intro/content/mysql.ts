// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "me",
//   password: "secret",
//   database: "my_db",
// });

// connection.connect();

// // no promises

// connection.query(
//   "SELECT 1 + 1 AS solution",
//   function (error: Error, results: any[], fields: any[]) {
//     if (error) throw error;

//     connection.query(
//       "SELECT * FROM users",
//       function (error: Error, results: any[], fields: any[]) {
//         if (error) throw error;

//         console.log(results);
//       },
//     );

//     console.log("The solution is: ", results[0].solution);
//   },
// );

function execute(query: string) {
  return new Promise((resolve, reject) => {
    // Call to DB... query

    if (query.includes("SELECT")) {
      return resolve(["Keven", "Joao"]);
    }

    reject(new Error("The query must be a SELECT..."));
  });
}

async function execute2(query: string) {
  if (query.includes("SELECT")) {
    return ["Keven", "Joao"];
  }

  throw new Error("The query must be a SELECT...");
}

// with promises

// const connection2 = await mysql.createConnection({ database: test });

const users = await execute("SELECT FROM USERS");

console.log(users);

execute2("DELETE FROM users")
  .then((response) => console.log(response))
  .catch((error) => console.error(error.message));
