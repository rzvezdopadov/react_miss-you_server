const PoolDB = require("pg").Pool;

export const poolDB = new PoolDB({
	user: "postgres",
	host: "localhost",
	database: "miss-you",
	password: "123456789",
	port: 5432,
});
