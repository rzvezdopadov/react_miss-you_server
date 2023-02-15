import { poolDB } from "../query/config";
import { dbShopInit } from "./shop";

export async function initDB(): Promise<boolean> {
	try {
		await dbShopInit();
		await initDBDialogs();
		await initDBStickers();
		await initDBUsers();

		return true;
	} catch (error) {
		console.log("initDB Error:", error);
		return false;
	}
}

async function initDBDialogs(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS dialogs (
                id serial PRIMARY KEY,
                userid1 TEXT,
                userid2 TEXT,
                timecode BIGINT,
                dck TEXT,
                messages JSON[]
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Dialogs Ok!");
		return true;
	} catch (error) {
		console.log("initDB Dialogs Error:", error);
		return false;
	}
}

async function initDBStickers(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS stickers (
                id serial PRIMARY KEY,
                idstickerpack TEXT,
                name TEXT,
                discription TEXT,
                price INT, 
                author TEXT,
                stickers JSON[]
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Stickers Ok!");
		return true;
	} catch (error) {
		console.log("initDB Stickers Error:", error);
		return false;
	}
}

async function initDBUsers(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS users (
                email TEXT,
                password TEXT,
                jwt TEXT,
                id serial PRIMARY KEY,
                userid TEXT,
                ipaddress TEXT,
                timecode BIGINT,
                name TEXT,
                latitude INT,
                longitude INT,
                location TEXT,
                likes TEXT[],
                birthday INT,
                monthofbirth INT,
                yearofbirth INT,
                growth INT,
                weight INT,
                gender INT,
                gendervapor INT,
                photomain INT,
                photolink TEXT[],
                signzodiac INT,
                education INT,
                fieldofactivity INT,
                maritalstatus INT,
                children INT,
                religion INT,
                smoke INT,
                alcohol INT,
                discription TEXT,
                profit INT,
                interests TEXT[],
                filters JSON,
                ilikecharacter INT[],
                idontlikecharacter INT[],
                raiting INT,
                cash INT,
                acctype TEXT,
                visit JSON[]
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Users Ok!");
		return true;
	} catch (error) {
		console.log("initDB Users Error:", error);
		return false;
	}
}
