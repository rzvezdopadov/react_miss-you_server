let alphabet = "abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789";

export function getRandomString(count: number): string {
	let str = "";

	if (!count) return str;

	for (let i = 0; i < count; i++) {
		var pos = Math.floor(Math.random() * alphabet.length);
		str += alphabet[pos];
	}

	return str;
}
