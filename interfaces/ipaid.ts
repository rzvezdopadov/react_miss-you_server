interface IPaidContent {
	enabled: false;
	timecode: number;
}

export interface IPaid {
	messageread: IPaidContent;
	longfilters: IPaidContent;
	userfavorite: IPaidContent;
	photoall: IPaidContent;
	photofull: IPaidContent;
}
