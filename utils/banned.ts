import { getAdminBannedByIdFromDB } from "../db/queryDB/admin";
import { getTimecodeNow } from "./datetime";

export async function isBannedUser(ourId: string): Promise<string> {
	const isBanned = await getAdminBannedByIdFromDB(ourId);

	if (isBanned.timecode && isBanned.timecode > getTimecodeNow()) {
		const date = new Date(Number(isBanned.timecode));

		return `Ваш аккаунт был забанен ${isBanned.whobanned} по причине ${
			isBanned.discription
		}, ваш аккаунт будет разбанен ${date.toLocaleDateString()} в ${date.toLocaleTimeString()} по МСК`;
	}

	return "";
}
