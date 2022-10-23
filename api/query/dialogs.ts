import { IDialog } from "../../interfaces/iprofiles";
import { poolDB } from "./config";

export async function getDialogByIdFromDB(id1: number, id2: number, idDialog: number = 0) {
    try {
        let answerDB = { rows: [] };

        let queryStr = 'SELECT id, id1, id2, timecode, dck, messages FROM messages WHERE ';

        if (idDialog) {
            queryStr += 'id = $1';

            answerDB = await poolDB.query(queryStr, [idDialog]);
        } else {
            queryStr += '(id1 = $1 AND id2 = $2) OR (id1 = $2 AND id2 = $1)';

            answerDB = await poolDB.query(queryStr, [id1, id2]);
        }

        return answerDB.rows[0];
    } catch (error) {
        console.log('getDialogByIdFromDB', error);
    }

    return [];
}

export async function setDialogByIdToDB(idDialog: number, dialog: IDialog) {
    const date = new Date();
    const timecode = date.getTime();

    let answerDB = { rows: [] };

    try {
        if (dialog.messages.length === 1) {
            const queryStr = 'INSERT INTO messages (id1, id2, timecode, dck, messages) VALUES ($1, $2, $3, $4, ARRAY [$5])';

            answerDB = await poolDB.query(queryStr, [dialog.id1, dialog.id2, timecode, dialog.dck, dialog.messages]);

            return answerDB.rows[0];
        } else {
            const queryStr = 'UPDATE users SET timecode = $2, messages = $3 WHERE id = $1';

            answerDB = await poolDB.query(queryStr, [idDialog, timecode, dialog.messages]);

            return answerDB.rows[0];
        }
    } catch (error) {
        console.log('setDialogByIdToDB', error);
    }

    return []
}

export async function getDialogsByIdFromDB(idUser: number) {
    try {
        let answerDB = { rows: [] };

        let queryStr = 'SELECT id, id1, id2, messages FROM messages WHERE id1 = $1 OR id2 = $1';
        
        answerDB = await poolDB.query(queryStr, idUser);

        return answerDB.rows[0];
    } catch (error) {
        console.log('getDialogsByIdFromDB', error);
    }

    return [];
}
