export const getWaySticker = (nameFile: string): string => {
	return process.cwd() + "/stickers/" + nameFile + ".png";
};
