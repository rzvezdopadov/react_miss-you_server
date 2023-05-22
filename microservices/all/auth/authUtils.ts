import { answerStatusAccessDenied } from "../../../utils/answerstatus";
import { getAcctypeByIdFromDB } from "../../admin/profile/profileDB";
import { ACCTYPE } from "../../role/role";

export async function isCandidateType(
	res: any,
	userId: string,
	acctype: ACCTYPE
): Promise<boolean> {
	try {
		const candidate = await getAcctypeByIdFromDB(userId);

		if (candidate !== acctype) {
			answerStatusAccessDenied(res);

			return false;
		}

		return true;
	} catch (error) {
		console.log("isCandidateType:", error);

		return false;
	}
}
