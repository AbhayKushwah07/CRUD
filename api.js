const http = require("http");
const fs = require("fs");
const path = require("path");
const connection = require("./db");

const server = http.createServer((req, res) => {
  //setting cors headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  //api for save data
  if (req.method === "POST" && req.url === "/signup") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      //   const formData = new URLSearchParams(body);
      //   const data = Object.fromEntries(formData);
      //   const email = data.email;
      const data = JSON.parse(body);
      const { email } = data;
      //check for duplicate
      const query1 = `Select * from user where email = ?`;
      connection.query(query1, email, (err, result) => {
        if (err) {
          console.error("Error:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          if (result.length > 0) {
            res.writeHead(400, { "Content-Type": "application/json" });

            res.end(
              JSON.stringify({
                result,
                success: false,
                msg: "User already have an account",
              })
              
            );
           
          } else {
            // after succesful check save data
            data.id = Math.floor(Math.random() * 1000000); // Generate random id
            // Insert data into MySQL database
            const query2 = "INSERT INTO user SET ?";
            connection.query(query2, data, (err, results) => {
              if (err) {
                console.error("Error inserting data into MySQL database:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
              } else {
                console.log("Data inserted into MySQL database:", results);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ data, success: true }));
                
              }
            });
          }
        }
      });
    });
  }

  // api for login
  else if (req.method === "POST" && req.url === "/login") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      //   const formData = new URLSearchParams(body);
      //   const email = formData.get("email");
      //   const password = formData.get("password");
      const formData = JSON.parse(body);
      const { email, password } = formData;

      const query = `Select * from user where email = ? and password = ?`;
      connection.query(query, [email, password], (err, result) => {
        if (err) {
          console.error("Error :", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          //check for valid credentials
          if (result.length == 0) {
            res.writeHead(400, { "Content-Type": "application/json" });

            res.end(JSON.stringify({ success: false }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result, success: true }));
          }
        }
      });
    });
  }

  //api for fetch all user
  else if (req.method === "GET" && req.url === "/fetchAllUser") {
    const query = `Select * from user`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error on fetching data:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ results, success: true }));
      }
    });
  }

  //api for delete user
  else if (req.method === "POST" && req.url === "/deleteUser") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { email } = JSON.parse(body);

      const query = `delete from user where email = "${email}"`;
      connection.query(query, (err, result) => {
        if (err) {
          console.error("Error :", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ result, success: true }));
        }
      });
    });
  }

  //update user api
  else if(req.method === "POST" && req.url === "/updateuser")
  {
 let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const  data = JSON.parse(body);

      const query = `update user set ? where email = "${data.email}"`;
      connection.query(query,data, (err, result) => {
        if (err) {
          console.error("Error :", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ result, success: true }));
        }
      });
    });
  }
  else
  {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end('Bad request');
  }

});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
