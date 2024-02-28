const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ubitech",
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err);
     
    }
    console.log("Connected to MySQL database");
  });

  module.exports=connection;