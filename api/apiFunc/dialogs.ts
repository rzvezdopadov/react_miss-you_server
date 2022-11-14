import {
	IDialogBase,
	IDialogOutput,
	IMessage,
	IProfile,
	IProfileForDialog,
} from "../../interfaces/iprofiles";
import { getJWTFromDB } from "../query/auth";
import {
	getDialogByIdFromDB,
	getDialogsByIdFromDB,
	setDialogByIdToDB,
} from "../query/dialogs";
import { getProfileByIdFromDB, getProfilesForDialogs } from "../query/profile";
import { getTimecodeNow, testOverflowJWT } from "./utility";

const config = require("config");
const jwtToken = require("jsonwebtoken");

export async function querySetMessage(req, res) {
	try {
		const { id, message } = req.body;

		const idUser = id;

		const { jwt } = req.cookies;

		const decode = await jwtToken.verify(jwt, config.get("jwtSecret"));

		if (testOverflowJWT(decode.exp)) {
			return res
				.status(400)
				.json({
					message: "Токен просрочен, повторите вход в систему!",
				});
		}

		const token = getJWTFromDB(decode.userId);

		token
			.then((token) => {
				if (token !== jwt) {
					return res
						.status(400)
						.json({ message: "Токен не валидный!" });
				}

				if (!idUser) {
					return res
						.status(400)
						.json({
							message:
								"Чтобы отправить сообщение, выберите пользователя!",
						});
				}

				const dialog = getDialogByIdFromDB(decode.userId, idUser);

				dialog
					.then((ourDialog: IDialogBase) => {
						if (!message)
							return res
								.status(400)
								.json({
									message: "Сообщение не может быть пустым!",
								});

						const newMessageObj: IMessage = {
							idUser: decode.userId,
							timecode: getTimecodeNow(),
							id1del: false,
							id2del: false,
							message: message,
						};

						if (ourDialog && Object.keys(ourDialog).length) {
							ourDialog.messages.push(newMessageObj);
						} else {
							const newDialog: IDialogBase = {
								id: 0,
								id1: decode.userId,
								id2: idUser,
								timecode: 0,
								dck: "",
								messages: [],
							};

							newDialog.messages.push(newMessageObj);
							ourDialog = newDialog;
						}

						const dialogSet = setDialogByIdToDB(ourDialog);

						dialogSet
							.then(() => {
								const dialog = getDialogByIdFromDB(
									decode.userId,
									id
								);

								dialog
									.then((ourDialog: IDialogBase) => {
										if (!ourDialog) {
											return res.status(200).json({});
										}

										const profileUser =
											getProfileByIdFromDB(id);

										profileUser
											.then(
												(profileUserData: IProfile) => {
													const newDialog: IDialogOutput =
														{
															timecode:
																ourDialog.timecode,
															idUser: id,
															name: profileUserData.name,
															age: profileUserData.age,
															photomain:
																profileUserData.photomain,
															photolink:
																profileUserData.photolink,
															messages:
																ourDialog.messages,
														};

													return res
														.status(200)
														.json(newDialog);
												}
											)
											.catch((error) => {
												console.log(error);

												return res
													.status(400)
													.json({
														message:
															"При авторизации произошла ошибка TBD!",
													});
											});
									})
									.catch((error) => {
										console.log(error);

										return res
											.status(400)
											.json({
												message:
													"При авторизации произошла ошибка TBD!",
											});
									});
							})
							.catch((error) => {
								console.log(error);

								return res
									.status(400)
									.json({
										message:
											"При авторизации произошла ошибка TBD!",
									});
							});
					})
					.catch((error) => {
						console.log(error);

						return res
							.status(400)
							.json({
								message:
									"При авторизации произошла ошибка TBD!",
							});
					});
			})
			.catch((error) => {
				console.log(error);

				return res
					.status(400)
					.json({ message: "При авторизации произошла ошибка TBD!" });
			});
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}

export async function queryGetDialog(req, res) {
	try {
		const { jwt } = req.cookies;

		const { id } = req.query;

		const decode = await jwtToken.verify(jwt, config.get("jwtSecret"));

		if (testOverflowJWT(decode.exp)) {
			return res
				.status(400)
				.json({
					message: "Токен просрочен, повторите вход в систему!",
				});
		}

		const token = getJWTFromDB(decode.userId);

		token
			.then((token) => {
				if (token !== jwt) {
					return res
						.status(400)
						.json({ message: "Токен не валидный!" });
				}

				const dialog = getDialogByIdFromDB(decode.userId, id);

				dialog
					.then((ourDialog: IDialogBase) => {
						const profileUser = getProfileByIdFromDB(id);

						profileUser
							.then((profile: IProfile) => {
								const newDialog: IDialogOutput = {
									timecode:
										(ourDialog && ourDialog.timecode) || 0,
									idUser: id,
									name: profile.name,
									age: profile.age,
									photomain: profile.photomain,
									photolink: profile.photolink,
									messages:
										(ourDialog && ourDialog.messages) || [],
								};

								return res.status(200).json(newDialog);
							})
							.catch((error) => {
								console.log(error);

								return res
									.status(400)
									.json({
										message:
											"При авторизации произошла ошибка TBD!",
									});
							});
					})
					.catch((error) => {
						console.log(error);

						return res
							.status(400)
							.json({
								message:
									"При авторизации произошла ошибка TBD!",
							});
					});
			})
			.catch((error) => {
				console.log(error);

				return res
					.status(400)
					.json({ message: "При авторизации произошла ошибка TBD!" });
			});
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}

export async function queryGetDialogs(req, res) {
	try {
		const { jwt } = req.cookies;

		const decode = await jwtToken.verify(jwt, config.get("jwtSecret"));

		if (testOverflowJWT(decode.exp)) {
			return res
				.status(400)
				.json({
					message: "Токен просрочен, повторите вход в систему!",
				});
		}

		const token = getJWTFromDB(decode.userId);

		token
			.then((token) => {
				if (token !== jwt) {
					return res
						.status(400)
						.json({ message: "Токен не валидный!" });
				}

				const dialogs = getDialogsByIdFromDB(decode.userId);

				dialogs
					.then((dialogs: Array<IDialogBase>) => {
						if (!dialogs.length) return res.status(200).json([]);

						const idUsers = dialogs.map((dialog) =>
							dialog.id1 === decode.userId
								? dialog.id2
								: dialog.id1
						);

						const users = getProfilesForDialogs(idUsers);

						users
							.then((users: Array<IProfileForDialog>) => {
								dialogs.sort((a, b) => {
									const id1 =
										a.id1 === decode.userId ? a.id2 : a.id1;
									const id2 =
										b.id1 === decode.userId ? b.id2 : b.id1;

									return id1 - id2;
								});

								users.sort((a, b) => a.id - b.id);

								let newDialogs: Array<IDialogOutput> = [];

								if (dialogs.length) {
									dialogs.forEach((value, index) => {
										const newDialog: IDialogOutput = {
											timecode: dialogs[index].timecode,
											idUser: users[index].id,
											name: users[index].name,
											age: users[index].age,
											photomain: users[index].photomain,
											photolink: users[index].photolink,
											messages: dialogs[index].messages,
										};

										newDialogs.push(newDialog);
									});

									newDialogs.sort(
										(a, b) =>
											b.messages[b.messages.length - 1]
												.timecode -
											a.messages[a.messages.length - 1]
												.timecode
									);
								} else {
									newDialogs = [];
								}

								return res.status(200).json(newDialogs);
							})
							.catch((error) => {
								console.log(error);

								return res
									.status(400)
									.json({
										message:
											"При авторизации произошла ошибка TBD!",
									});
							});
					})
					.catch((error) => {
						console.log(error);

						return res
							.status(400)
							.json({
								message:
									"При авторизации произошла ошибка TBD!",
							});
					});
			})
			.catch((error) => {
				console.log(error);

				return res
					.status(400)
					.json({ message: "При авторизации произошла ошибка TBD!" });
			});
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}
