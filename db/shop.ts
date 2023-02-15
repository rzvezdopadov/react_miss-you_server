import { poolDB } from "../query/config";

const ratingTariffs = [
	{
		idRate: "rating1",
		amountRate: 1,
		price: 10,
		discount: 0,
	},
	{
		idRate: "rating2",
		amountRate: 3,
		price: 27,
		discount: 5,
	},
	{
		idRate: "rating3",
		amountRate: 10,
		price: 90,
		discount: 10,
	},
	{
		idRate: "rating4",
		amountRate: 50,
		price: 400,
		discount: 20,
	},
	{
		idRate: "rating5",
		amountRate: 100,
		price: 700,
		discount: 30,
	},
	{
		idRate: "rating6",
		amountRate: 200,
		price: 1200,
		discount: 40,
	},
	{
		idRate: "rating7",
		amountRate: 500,
		price: 2500,
		discount: 50,
	},
];

const shopRatingGenerate = (): string => {
	let strTariffs = "";
	ratingTariffs.forEach((value) => {
		strTariffs += `'${JSON.stringify(value)}' :: JSON, `;
	});
	strTariffs = strTariffs.slice(0, -2);

	let str = `INSERT INTO public.shop(ratingtariffs) VALUES (ARRAY [${strTariffs}]);`;
	return str;
};

export async function dbShopInit(): Promise<boolean> {
	try {
		let queryStr = `
            CREATE TABLE IF NOT EXISTS shop (
                id serial PRIMARY KEY,
                ratingtariffs JSON[]
            );
        `;

		await poolDB.query(queryStr);

		queryStr = `SELECT ratingtariffs FROM shop`;

		const answerDB = await poolDB.query(queryStr);

		if (!answerDB.rows[0]) {
			queryStr = shopRatingGenerate();

			await poolDB.query(queryStr);
		}

		console.log("dbShopInit Ok!");
		return true;
	} catch (error) {
		console.log("dbShopInit Error:", error);
		return false;
	}
}
