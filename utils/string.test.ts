import { getRandomString } from "./string";

let testArrClassic: Array<number> = [];
for (let i = 0; i < 3; i++)
	testArrClassic.push(1 + Math.floor(Math.random() * 30));

describe.each(testArrClassic)("getRandomString classic test", (value) => {
	test(`input: ${value}`, () => {
		expect(getRandomString(value).length).toBe(value);
	});
	test(`input: ${value}`, () => {
		expect(typeof getRandomString(value)).toBe("string");
	});
});

const testArrSpecial = [
	Math.floor(Math.random() * 30) - 50,
	-[],
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
