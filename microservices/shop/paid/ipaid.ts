interface IPaidContent {
	enabled: boolean;
	timecode: number;
}

export interface IPaid {
	messageswrite: IPaidContent;
	messagesread: IPaidContent;
	longfilters: IPaidContent;
	filtersvapors: IPaidContent;
	longfiltersvapors: IPaidContent;
	filtersfavoriteusers: IPaidContent;
	longfiltersfavoriteusers: IPaidContent;
	photofull: IPaidContent;
	photoload10: IPaidContent;
	photoload15: IPaidContent;
	photoload20: IPaidContent;
	photoload25: IPaidContent;
	photoload30: IPaidContent;
	interests20: IPaidContent;
	interests30: IPaidContent;
	historymessages20: IPaidContent;
	historymessages40: IPaidContent;
	historymessages60: IPaidContent;
	historymessages80: IPaidContent;
	historymessages100: IPaidContent;
	historymessages200: IPaidContent;
	historymessages300: IPaidContent;
}

export enum PAID_PROPERTY {
	messageswrite = `messageswrite`,
	messagesread = `messagesread`,
	longfilters = `longfilters`,
	filtersvapors = `filtersvapors`,
	longfiltersvapors = `longfiltersvapors`,
	filtersfavoriteusers = `filtersfavoriteusers`,
	longfiltersfavoriteusers = `longfiltersfavoriteusers`,
	photofull = `photofull`,
	photoload10 = `photoload10`,
	photoload15 = `photoload15`,
	photoload20 = `photoload20`,
	photoload25 = `photoload25`,
	photoload30 = `photoload30`,
	interests20 = `interests20`,
	interests30 = `interests30`,
	historymessages20 = `historymessages20`,
	historymessages40 = `historymessages40`,
	historymessages60 = `historymessages60`,
	historymessages80 = `historymessages80`,
	historymessages100 = `historymessages100`,
	historymessages200 = `historymessages200`,
	historymessages300 = `historymessages300`,
}

export interface ITariff {
	idTariff: string;
	amountDay?: number;
	amountRate?: number;
	price: number;
	discount: number;
}
