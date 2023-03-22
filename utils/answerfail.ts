export function answerFailJWT(res: any) {
	return res.status(400).json({
		message: "Токен не валидный!",
	});
}

export function answerFailAccessDenied(res: any) {
	return res.status(403).json({
		message: "У вас нет прав доступа на выполнение данной операции!",
	});
}

export function answerFailQTDB(res: any, error?: any) {
	if (error) console.log(error);
	return res.status(500).json({
		message: "Ошибка QTDB!",
	});
}
