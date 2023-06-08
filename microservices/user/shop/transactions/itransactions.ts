import { SHOP_TARIFFS } from "../ishop";
import { PAID_PROPERTY } from "../paid/ipaid";

export enum ITransUserFrom {
	system = "system",
	payment = "payment",
	admin = "admin",
}

export interface ITransactionOutShort {
	timecode: number;
	userfrom: ITransUserFrom;
	idtrans: string;
	cash: number;
	discription: string;
}

export interface ITransactionOut extends ITransactionOutShort {
	nametariff: PAID_PROPERTY | SHOP_TARIFFS;
	idtariff: string;
}

export interface ITransaction extends ITransactionOut {
	userid: string;
}
