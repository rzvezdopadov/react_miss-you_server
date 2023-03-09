export interface IStatVisit {
	key: string;
	tco: number;
	tcc: number;
}

export interface IStatisticsVisit {
	userid: string;
	visit: IStatVisit[];
}
