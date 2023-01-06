export function getTimecodeNow() {
	const dateNow = new Date();
	const timecodeNow = dateNow.getTime();
	return timecodeNow;
}

export const getYearFromAge = (year: number): number => {
	const date = new Date();
	const yearNow = date.getFullYear();
	return yearNow - year;
};
