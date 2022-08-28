import { IProfile, IQueryGetProfiles } from "../interfaces/iprofiles";
import { fakeData } from "./fakedata";

const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'miss-you',
    password: '123456789',
    port: 5432,
})

/* Fake database */
const userList = fakeData;
/* Fake database */

export async function getIdByEmailFromDB(email: string) {
    try {
        const answerDB = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        return answerDB.rows[0].id;
    } catch (error) {
        console.log(error);
    }
   
    return -1;
}

export async function getPasswordByIdFromDB(id: number) {
    try {
        const answerDB = await pool.query('SELECT password FROM users WHERE id = $1', [id]);

        return answerDB.rows[0].password;
    } catch (error) {
        console.log(error);
    }
   
    return '';
}

const fieldProfile = 'id, name, latitude, longitude, location, ' +
'likes, age, birthday, monthofbirth, yearofbirth, ' +
'gender, gendervapor, photomain, photolink, signzodiac, ' +
'education, fieldofactivity, maritalstatus, children, religion, ' +
'rise, smoke, alcohol, discription, profit, interests, ' +
'ilikeCharacter, idontlikeCharacter, vapors, likepeoples, dislikepeoples ';

export async function getProfileByIdFromDB(id: number) {
    try {
        let queryStr = 'SELECT ' + fieldProfile + 'FROM users WHERE id = $1';
        const answerDB = await pool.query(queryStr, [id]);

        if (!answerDB.rows[0]) return {}

        return answerDB.rows[0];
    } catch (error) {
        console.log('getProfileByIdFromDB', error);
    }

    return {};
}

export async function getProfiles(QueryGetProfiles: IQueryGetProfiles) {
    let countProfiles = 0;
    const startPos = Number(QueryGetProfiles.startcount);
    const endPos = startPos + Number(QueryGetProfiles.amount);
    const { filters } = QueryGetProfiles;

    try {
        let queryStr = 'SELECT ' + fieldProfile + 'FROM users WHERE ' +
        '(location = $1) AND ';

        if (filters.signzodiac === 12) {
            queryStr += '(signzodiac <> $2) AND ';
        } else {
            queryStr += '(signzodiac = $2) AND ';
        }

        queryStr += '(age >= $3) AND (age <= $4) AND ';
        queryStr += '(gendervapor = $5) AND ';

        if (filters.religion === 0) {
            queryStr += '((religion <> $6) OR (religion = 0)) AND ';
        } else {
            queryStr += '(religion = $6) AND ';
        }

        if (filters.smoke === 0) {
            queryStr += '((smoke <> $7) OR (smoke = 0)) AND ';
        } else {
            queryStr += '(smoke = $7) AND ';
        }

        if (filters.alcohol === 0) {
            queryStr += '((alcohol <> $8) OR (alcohol = 0)) AND ';
        } else {
            queryStr += '(alcohol = $8) AND ';
        }

        queryStr += '(id <> $9)';
        
        const answerDB = await pool.query(queryStr, [
            filters.location, 
            filters.signzodiac,
            filters.agestart, filters.ageend,
            filters.gendervapor, 
            filters.religion,
            filters.smoke,
            filters.alcohol,
            QueryGetProfiles.id
        ]);

        return answerDB.rows;
    } catch (error) {
        console.log('getProfiles', error);
    }

    return [];
}

export function setProfile(profile: IProfile) {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === profile.id) {
            for (let key in profile) {
                userList[i][key] = profile[key];
            }

            return true;
        }
    }

    return false;
}

export function setProfileShort(profile: IProfile) {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === profile.id) {

            return true;
        }
    }

    return false;
}


export async function setJWTToDB(id: number, jwt: string) { // Set JWT in DB
    try {
        const answerDB = await pool.query("UPDATE users SET jwt = $1 WHERE id = $2", [jwt, id]);

        return answerDB.rowCount;
    } catch (error) {
        console.log(error);
    }
   
    return 0;
}

export async function getJWTFromDB(id: number) { // Get JWT in DB
    try {
        const answerDB = await pool.query('SELECT jwt FROM users WHERE id = $1', [id]);

        return answerDB.rows[0].jwt;
    } catch (error) {
        console.log(error);
    }
   
    return '';
}

export function createProfile(profile: IProfile) { // Create base Profile in DB
    // let id = 0;

    // for (let i = 0; i < userList.length; i++) {
    //     id = Math.max(id, userList[i].id);
    // }

    // profile.id = id + 1;

    // userList.push(profile);

    return true;
}
