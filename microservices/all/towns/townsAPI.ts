import { answerStatusQTDB } from "../../../utils/answerstatus";
import { townsData } from "./townsData";

export async function queryGetTowns(req, res) {
	try {
		return res.status(200).json(townsData);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
