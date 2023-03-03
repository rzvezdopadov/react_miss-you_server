let alphabet = "abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789";

export function getRandomString(count: number): string {
	let str = "";

	if (!count || count > 50) return str;

	for (let i = 0; i < count; i++) {
		var pos = Math.floor(Math.random() * alphabet.length);
		str += alphabet[pos];
	}

	return str;
}

export function getRandomInteger(min: number, max: number): number {
	let difference = max - min + 1;

	if (min > max) difference = min - max + 1;

	const mul = Math.random() * difference;
	const conv = Math.floor(mul);
	const add = min + conv;

	return add;
}

export function getUniqueIntegerArr(
	min: number,
	max: number,
	count: number
): number[] {
	const arr = [];
	let difference = max - min + 1;

	if (count > difference) return arr;

	function genUnicueInteger(arr: number[]) {
		const value = getRandomInteger(min, max);

		if (arr.includes(value)) {
			genUnicueInteger(arr);
		} else {
			arr.push(value);
		}
	}

	for (let i = 0; i < count; i++) {
		genUnicueInteger(arr);
	}

	return arr;
}
