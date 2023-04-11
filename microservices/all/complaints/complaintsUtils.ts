import { IComplaintBase } from "./icomplaints";
import { getComplaintsByIdFromDB, setComplaintByIdToDB } from "./complaintsDB";

export const getComplaints = async (
	ourId: string
): Promise<IComplaintBase[]> => {
	try {
		const complaints = await getComplaintsByIdFromDB(ourId);

		complaints.sort((a, b) => a.timecode - b.timecode);

		return complaints;
	} catch (error) {
		console.log("getComplaints", error);
		return [];
	}
};

export const setComplaint = async (
	complaint: IComplaintBase
): Promise<IComplaintBase> => {
	try {
		await setComplaintByIdToDB(complaint);

		return complaint;
	} catch (error) {
		console.log("setComplaint", error);
		return complaint;
	}
};
