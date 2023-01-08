const { createCanvas } = require("canvas");
const widthCanvas = 180;
const heightCanvas = 40;

interface ICaptcha {
	str: string;
	livetime: number;
}
let captchaArr: ICaptcha[] = [];

const getCoord = (num) => Math.floor(Math.random() * num);
const alphabet = "abcdefhjkmnopqrstuvwxyzABCDEFGHJKLMNOPRSTQPRSTUVWXYZ2345678";
const getStrRand = (num) => {
	let str = "";
	for (let i = 0; i < num; i++) {
		str += alphabet[getCoord(alphabet.length)];
	}
	return str;
};

export async function queryGetCaptcha(req, res) {
	try {
		const canvas = createCanvas(widthCanvas, heightCanvas);
		const context = canvas.getContext("2d");

		const strRand = getStrRand(5 + getCoord(3));

		context.fillStyle = "#000";
		context.fillRect(0, 0, widthCanvas, heightCanvas);

		context.font = "24px Arial";

		const colorRange = 150;

		for (let i = 0; i < strRand.length; i++) {
			context.strokeStyle = `rgb(${
				255 - colorRange + getCoord(colorRange)
			}, ${255 - colorRange + getCoord(colorRange)}, ${
				255 - colorRange + getCoord(colorRange)
			})`;
			context.strokeText(
				strRand[i],
				10 + (i * (widthCanvas - 10)) / strRand.length,
				20 + getCoord(10)
			);
		}

		context.lineWidth = 1;

		for (let i = 0; i < 3; i++) {
			context.strokeStyle = `rgb(${
				255 - colorRange + getCoord(colorRange)
			}, ${255 - colorRange + getCoord(colorRange)}, ${
				255 - colorRange + getCoord(colorRange)
			})`;

			context.beginPath();
			context.moveTo(getCoord(30), getCoord(heightCanvas));
			context.lineTo(widthCanvas - getCoord(30), getCoord(heightCanvas));
			context.stroke();
		}

		const buffer = canvas.toBuffer("image/jpeg");

		res.writeHead(200, {
			"Content-Type": "image/jpeg",
			"Cache-Control": "no-cache",
		});
		res.end(buffer);

		captchaArr.push({
			str: strRand,
			livetime: 120,
		});
		if (captchaArr.length > 10000000) captchaArr = [];
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Что-то пошло не так при получении капчи!",
		});
	}
}

export function isHaveCaptcha(str: string): boolean {
	for (let i = 0; i < captchaArr.length; i++) {
		if (captchaArr[i].str === str) {
			captchaArr[i].livetime = 0;
			return true;
		}
	}

	return false;
}

setInterval(() => {
	const newArr: ICaptcha[] = [];

	captchaArr.forEach((elem) => {
		if (--elem.livetime > 0) newArr.push(elem);
	});

	captchaArr = newArr;
}, 1000);
