import { initDBShop } from "./shop";
import { initDBDialogs } from "./dialogs";
import { initDBStickerpacks } from "./stickerpacks";
import { initDBUsers } from "./users";

export async function initDB(): Promise<boolean> {
	try {
		await initDBShop();
		await initDBDialogs();
		await initDBStickerpacks();
		await initDBUsers();

		return true;
	} catch (error) {
		console.log("initDB Error:", error);
		return false;
	}
}
