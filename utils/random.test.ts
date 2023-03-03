import { getRandomString } from "./random";

const testArrClassic: Array<number> = [];
for (let i = 0; i < 3; i++)
	testArrClassic.push(1 + Math.floor(Math.random() * 30));

describe.each(testArrClassic)("getRandomString classic test", (value) => {
	it(`input: ${value}`, () => {
		const str = getRandomString(value);
		expect(str.length).toBe(value);
		expect(typeof str).toBe("string");
	});
});

const testArrSpecial = [
	Math.floor(Math.random() * 30) - 50,
	[],
	{},
	null,
	undefined,
	Infinity,
];

describe.each(testArrSpecial)("getRandomString special test", (value) => {
	test(`input: ${value}`, () => {
		expect(getRandomString(Number(value))).toBe("");
	});
});
