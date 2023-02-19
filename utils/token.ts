import { getJWTFromDB } from "../query/auth";

const config = require("config");
const jwtToken = require("jsonwebtoken");

interface IdecodeJWT {
	userId: string;
	iat: number;
	exp: number;
}

export function testOverflowJWT(jwtExp: number = 0) {
	if (Math.round(Date.now() / 1000) > jwtExp) return true;

	return false;
}

export const testToken = async (jwt: string) => {
	if (!jwt) return false;

	try {
		const decode = (await jwtToken.verify(
			jwt,
			config.get("jwtSecret")
		)) as IdecodeJWT;

		if (testOverflowJWT(decode.exp)) {
			return false;
		}

		const userId = decode.userId;

		const token = await getJWTFromDB(userId);

		if (!token.length) return false;

		for (let i = 0; i < token.length; i++) {
			if (token[i].token === jwt) {
				decode.userId = String(decode.userId);

				return decode;
			}
		}

		return false;
	} catch (error) {
		return false;
	}
};
