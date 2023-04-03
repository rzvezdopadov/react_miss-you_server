import { initDBComplaints } from "../microservices/initdb/complaints/complaintsDBInit";
import { initDBDialogs } from "../microservices/initdb/dialogs/dialogsDBInit";
import { initDBShop } from "../microservices/initdb/shop/shopDBInit";
import { initDBStickerpacks } from "../microservices/initdb/shop/stickerpacksDBInit";
import { initDBUsers } from "../microservices/initdb/users/usersDBInit";

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
