import { ISocketUsers } from "./isocket";

export const getUserIdFromSocketTable = (sockets: ISocketUsers[], socketId) => {
	for (let i = 0; i < sockets.length; i++) {
		if (sockets[i].socketid === socketId) {
			return sockets[i].userid;
		}
	}

	return "";
};

export const sendToAllSocketsById = (
	socketIO,
	sockets: ISocketUsers[],
	useridarr: string[],
	nameCommand: string,
	payload: object
) => {
	sockets.forEach((socketuser) => {
		if (useridarr.includes(socketuser.userid))
			socketIO.to(socketuser.socketid).emit(nameCommand, payload);
	});
};
