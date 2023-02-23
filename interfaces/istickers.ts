export interface ISticker {
	position: number;
	associate: string;
	link: string;
}

export interface IStickerpack {
	idstickerpack: string;
	name: string;
	discription: string;
	price: number;
	author: string;
	stickers: ISticker[];
}

export interface IQuerySendSticker {
	userid: string;
	stickerpackid: string;
	stickerpos: number;
}
