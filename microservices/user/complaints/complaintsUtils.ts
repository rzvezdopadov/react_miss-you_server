import { IComplaintOutput } from "./icomplaints";
import { getComplaintsByIdFromDB } from "./complaintsDB";
import { getProfilesForDialogsFromDB } from "../profile/profileDB";

export const getComplaints = async (
	ourId: string
): Promise<IComplaintOutput[]> => {
	try {
		const complaints = await getComplaintsByIdFromDB(ourId);

		if (!complaints.length) return [];

		const idUsers = complaints.map((dialog) => dialog.userto);

		const users = await getProfilesForDialogsFromDB(idUsers);

		complaints.sort((a, b) => {
			const id1 = a.userto;
			const id2 = b.userto;

			if (id1 > id2) {
				return 1;
			}
			if (id1 < id2) {
				return -1;
			}
			return 0;
		});

		users.sort((a, b) => {
			if (a.userid > b.userid) {
				return 1;
			}

			if (a.userid < b.userid) {
				return -1;
			}

			return 0;
		});

		let newComlaints: IComplaintOutput[] = [];

		if (complaints.length) {
			complaints.forEach((complaint, index) => {
				if (complaint.userto !== users[index].userid) return;

				const newComplaint: IComplaintOutput = {
					timecode: complaint.timecode,
					userid: users[index].userid,
					userto: complaint.userto,
					name: users[index].name,
					birthday: users[index].birthday,
					monthofbirth: users[index].monthofbirth,
					yearofbirth: users[index].yearofbirth,
					photolink: users[index].photolink[users[index].photomain],
					subject: complaint.subject,
					status: complaint.status,
					messages: complaint.messages,
					complmessages: complaint.complmessages,
				};

				newComlaints.push(newComplaint);
			});

			newComlaints.sort(
				(a, b) =>
					b.messages[b.messages.length - 1].timecode -
					a.messages[a.messages.length - 1].timecode
			);
		} else {
			newComlaints = [];
		}
		return newComlaints;
	} catch (error) {
		console.log("getComplaints", error);
		return [];
	}
};
