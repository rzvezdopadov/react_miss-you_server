import { getTimedateNow } from "./datetime";

export function answerStatus(res: any, status: number, message: string) {
	return res.status(status).json({
		message,
	});
}

export function answerStatus200(res: any, message: string) {
	return answerStatus(res, 200, message);
}

export function answerStatus400(res: any, message: string) {
	return answerStatus(res, 400, message);
}

export function answerStatus500(res: any, message: string) {
	return answerStatus(res, 500, message);
}

export function answerStatusJWT(res: any) {
	return answerStatus400(res, "Токен не валидный!");
}

export function answerStatusAccessDenied(res: any) {
	return answerStatus(
		res,
		403,
		"У вас нет прав доступа на выполнение данной операции!"
	);
}

export function answerStatusQTDB(res: any, error?: any) {
	if (error) console.log(`${getTimedateNow()}: "answerStatusQTDB" ${error}`);
	return answerStatus500(res, "Ошибка QTDB!");
}
