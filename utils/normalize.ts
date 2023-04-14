export function normalizeString(str: string): string {
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
