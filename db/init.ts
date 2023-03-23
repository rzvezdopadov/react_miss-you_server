import { initDBShop } from "../microservices/shop/shopDBInit";
import { initDBDialogs } from "../microservices/dialogs/dialogsDBInit";
import { initDBStickerpacks } from "../microservices/shop/stickerpacks/stickerpacksDBInit";
import { initDBUsers } from "../microservices/users/usersDBInit";
import { initDBComplaints } from "../microservices/complaints/complaintsDBInit";

export async function initDB(): Promise<boolean> {
	try {
		await initDBShop();
		await initDBDialogs();
		await initDBStickerpacks();
		await initDBUsers();
		await initDBComplaints();

		return true;
	} catch (error) {
		console.log("initDB Error:", error);
		return false;
	}
}
