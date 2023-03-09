import { getLikesByIdFromDB, setLikesByIdToDB } from "../db/queryDB/likes";

export const setLikesById = async (ourId: string, userId: string) => {
	try {
		let likes = await getLikesByIdFromDB(userId);

		if (userId === "") {
			return likes;
		}

		const posLike = likes.indexOf(ourId);

		const commandDelete = "delete";
		const commandAdded = "added";
		let command = commandDelete;

		if (posLike === -1) {
			likes.push(ourId);

			command = commandAdded;
		} else {
			likes.splice(posLike, 1);
		}

		const likeCommand = await setLikesByIdToDB(userId, likes);

		if (likeCommand) {
			if (command === commandAdded) {
				likes = [ourId];
			} else {
				likes = [];
			}

			return likes;
		}

		return likes;
	} catch (error) {
		console.log(error);

		return [];
	}
};
