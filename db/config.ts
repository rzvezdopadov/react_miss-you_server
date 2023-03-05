const PoolDB = require("pg").Pool;
const config = require("config");

export const poolDB = new PoolDB({
	user: config.get("DBuser"),
	host: config.get("DBhost"),
	database: config.get("DBdatabase"),
	password: config.get("DBpassword"),
	port: config.get("DBport"),
});
