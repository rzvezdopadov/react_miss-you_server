const nodemailer = require("nodemailer");
const config = require("config");

export async function sendMessageToEmail(link: string, email: string) {
	try {
		const emailUser = config.get("emailUser");

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: emailUser,
				pass: config.get("emailPass"),
			},
		});

		const mailOptions = {
			from: emailUser,
			to: email,
			subject: "Восстановление пароля",
			text: `Здравствуй уважаемый пользователь, вот твоя ссылка ${link} для восстановления пароля =)`,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
	} catch (error) {
		console.log(error);
	}
}
