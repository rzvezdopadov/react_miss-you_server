import { initDBComplaints } from "../microservices/initdb/complaints/complaintsDBInit";
import { initDBMessages } from "../microservices/initdb/messages/messagesDBInit";
import { initDBShop } from "../microservices/initdb/shop/shopDBInit";
import { initDBStickerpacks } from "../microservices/initdb/shop/stickerpacks/stickerpacksDBInit";
import { initDBTransactions } from "../microservices/initdb/transactions/transactionsDBInit";
import { initDBUsers } from "../microservices/initdb/users/usersDBInit";

export async function initDB(): Promise<boolean> {
	try {
		await initDBShop();
		await initDBMessages();
		await initDBStickerpacks();
		await initDBUsers();
		await initDBComplaints();
		await initDBTransactions();

		return true;
	} catch (error) {
		console.log("initDB Error:", error);
		return false;
	}
}
