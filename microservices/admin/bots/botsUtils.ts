import { IBotRequest } from "./ibots";
import { botDictionaryCensure, botDictionarySpam } from "./botsData";
import { getTimecodeNow } from "../../../utils/datetime";

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
// const day = 24 * hour;

const timeBlockBotPhraseSpam = 6 * hour;

export function botPhraseSpam(message: string): IBotRequest {
	const newMessage = message.toLowerCase();

	for (let i = 0; i < botDictionarySpam.length; i++) {
		if (newMessage.includes(botDictionarySpam[i]))
			return {
				enabled: true,
				whobanned: "'Ботом спама'",
				discription: "'За нарушение пункта правил сайта 10.1'",
				timecode: getTimecodeNow() + timeBlockBotPhraseSpam,
			};
	}

	return { enabled: false, whobanned: "", discription: "", timecode: 0 };
}

const timeBlockBotPhraseCensure = 6 * hour;

export function botPhraseCensure(message: string): IBotRequest {
	const newMessage = message.toLowerCase();

	for (let i = 0; i < botDictionaryCensure.length; i++) {
		if (newMessage.includes(botDictionaryCensure[i]))
			return {
				enabled: true,
				whobanned: "'Ботом цензуры'",
				discription: "'За нарушение пункта правил сайта 12.3'",
				timecode: getTimecodeNow() + timeBlockBotPhraseCensure,
			};
	}

	return { enabled: false, whobanned: "", discription: "", timecode: 0 };
}
