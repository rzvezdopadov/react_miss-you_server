export function getTimecodeNow() {
	const dateNow = new Date();
	const timecodeNow = dateNow.getTime();
	return timecodeNow;
}
