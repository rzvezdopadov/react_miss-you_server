import { poolDB } from "../query/config";

export async function initDBUsers(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS users (
                email TEXT,
                password TEXT,
                jwt TEXT,
                id serial PRIMARY KEY,
                userid TEXT,
                coordinates JSON[],
                registrationdate BIGINT,
                timecode BIGINT,
                name TEXT,
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
                stickerpacks TEXT[],
                rating INT,
                cash INT,
                acctype TEXT,
                banned JSON, 
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
