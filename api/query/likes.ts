import { poolDB } from "./config";

export async function getLikesByIdFromDB(id: number) {
    try {
        let queryStr = 'SELECT likes FROM users WHERE id = $1';
        const answerDB = await poolDB.query(queryStr, [id]);

        return answerDB.rows[0].likes;
    } catch (error) {
        console.log('getProfileByIdFromDB', error);
    }

    return {};
}

export async function setLikesByIdFromDB(id: number, arr: [number]) {
    try {
        let queryStr = 'UPDATE users SET likes = $1 WHERE id = $2';
        
        const answerDB = await poolDB.query(queryStr, [arr, id]);

        return answerDB.rowCount;
    } catch (error) {
        console.log('setLikesByIdFromDB', error);
    }

    return 0;
}
