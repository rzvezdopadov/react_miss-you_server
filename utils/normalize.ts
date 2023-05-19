export function normalizeString(str: string): string {
	if (!str) return "";
	if (typeof str !== "string") return "";

	str = str.replace(/[' ']/g, "");

	return str;
}

export function normalizeArrString(arr) {
	const newArr = [];

	arr.forEach((str) => {
		if (typeof str === "string") {
			newArr.push(normalizeString(str));
		}
	});

	return newArr;
}

export function normalizeNumber(num: number): number {
	const type = typeof num;

	if (!(type === "number" || type === "string")) return 0;

	const newNum = Number(num);

	if (Number.isNaN(newNum)) return 0;

	return newNum;
}
