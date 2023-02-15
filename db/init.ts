import { initDBDialogs } from "./dialogs";
import { initDBShopInit } from "./shop";
import { initDBStickerpacks } from "./stickerpacks";
import { initDBUsers } from "./users";

export async function initDB(): Promise<boolean> {
	try {
		await initDBShopInit();
		await initDBDialogs();
		await initDBStickerpacks();
		await initDBUsers();

		return true;
	} catch (error) {
		console.log("initDB Error:", error);
		return false;
	}
}
