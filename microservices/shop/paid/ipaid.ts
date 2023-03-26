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

export interface ITariff {
	idTariff: string;
	amountDay: number;
	price: number;
	discount: number;
}
