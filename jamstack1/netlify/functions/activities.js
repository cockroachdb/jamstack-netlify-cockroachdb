const { Pool } = require("pg");
const format = require("pg-format");

  const client = new Pool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  user: process.env.USERNAME,
  ssl: {
    ca : process.env.DB_CERT
   },
  });

  exports.handler = async ({ queryStringParameters }, context, callback) => {
   const { order } = queryStringParameters;

   try {
    const clientPool = await client.connect();

     const sqlStatement = format(
       "SELECT * FROM activities ORDER BY date_created %s",
       order || "ASC"
     );

     const { rows } = await clientPool.query(sqlStatement);

     return {
       statusCode: 200,
       body: JSON.stringify({ data: rows }),
     };
   } catch (e) {
     clientPool.release();

     return {
       statusCode: 500,
       body: JSON.stringify({
         response: "An internal server error occurred"
       }),
     };
   }
  };

