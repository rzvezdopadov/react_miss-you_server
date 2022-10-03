import { IGetProfiles, IProfile, IQueryGetProfiles } from "../interfaces/iprofiles";
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'miss-you',
    password: '123456789',
    port: 5432,
})


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
'likes, age, birthday, monthofbirth, yearofbirth, growth, weight, ' +
'gender, gendervapor, photomain, photolink, signzodiac, ' +
'education, fieldofactivity, maritalstatus, children, religion, ' +
'smoke, alcohol, discription, profit, interests, ' +
'ilikeCharacter, idontlikeCharacter';

const fieldFilters = 'location, signzodiac, agestart, ageend, ' +
'growthstart, growthend, weightstart, weightend, gendervapor, ' +
'religion, smoke, alcohol, interests'
;

export async function getProfileByIdFromDB(id: number) {
    try {
        let queryStr = 'SELECT ' + fieldProfile + ' FROM users WHERE id = $1';
        const answerDB = await pool.query(queryStr, [id]);

        if (!answerDB.rows[0]) return {}

        let queryStrFilters = 'SELECT ' + fieldFilters + ' FROM filters WHERE id = $1';
        const answerDBFilters = await pool.query(queryStrFilters, [id]);

        if (!answerDBFilters.rows[0]) return {}

        console.log(answerDBFilters.rows[0]);

        answerDB.rows[0].filters = answerDBFilters.rows[0];

        return answerDB.rows[0];
    } catch (error) {
        console.log('getProfileByIdFromDB', error);
    }

    return {};
}

const fieldProfileShort = 'id, name, age, photomain, photolink, interests';

export async function getProfiles(QueryGetProfiles: IGetProfiles) {
    let countProfiles = 0;
    const startPos = Number(QueryGetProfiles.startcount);
    const endPos = startPos + Number(QueryGetProfiles.amount);
    const { filters, users } = QueryGetProfiles;

    try {
        let answerDB = { rows: [] };

        let queryStr = 'SELECT ' + fieldProfileShort + ' FROM users WHERE ';

        if (filters) {
            queryStr += '(location = $1) AND ';

            if (filters.signzodiac === 12) {
                queryStr += '(signzodiac <> $2) AND ';
            } else {
                queryStr += '(signzodiac = $2) AND ';
            }

            queryStr += '(age >= $3) AND (age <= $4) AND ';
            queryStr += '(growth >= $5) AND (growth <= $6) AND ';
            queryStr += '(weight >= $7) AND (weight <= $8) AND ';

            queryStr += '(gendervapor = $9) AND ';

            if (filters.religion === 0) {
                queryStr += '((religion <> $10) OR (religion = 0)) AND ';
            } else {
                queryStr += '(religion = $10) AND ';
            }

            if (filters.smoke === 0) {
                queryStr += '((smoke <> $11) OR (smoke = 0)) AND ';
            } else {
                queryStr += '(smoke = $11) AND ';
            }

            if (filters.alcohol === 0) {
                queryStr += '((alcohol <> $12) OR (alcohol = 0)) AND ';
            } else {
                queryStr += '(alcohol = $12) AND ';
            }

            queryStr += '(id <> $13)';

            console.log(filters.gendervapor);
            
            answerDB = await pool.query(queryStr, [
                filters.location, 
                filters.signzodiac,
                filters.agestart, filters.ageend,
                filters.growthstart, filters.growthend,
                filters.weightstart, filters.weightend,
                filters.gendervapor,
                filters.religion,
                filters.smoke,
                filters.alcohol,
                QueryGetProfiles.id
            ]);
        } else if (users) {
            if (users.length === 0) {
                '(id = 0) OR'
            } else {
                users.forEach((value) => {
                    queryStr += '(id = ' + value + ') OR ';
                })
            }

            queryStr = queryStr.slice(0, -3);
            answerDB = await pool.query(queryStr);
        }

        return answerDB.rows;
    } catch (error) {
        console.log('getProfiles', error);
    }

    return [];
}

export function setProfile(profile: IProfile) {
    // for (let i = 0; i < userList.length; i++) {
    //     if (userList[i].id === profile.id) {
    //         for (let key in profile) {
    //             userList[i][key] = profile[key];
    //         }

    //         return true;
    //     }
    // }

    return false;
}

export function setProfileShort(profile: IProfile) {
    // for (let i = 0; i < userList.length; i++) {
    //     if (userList[i].id === profile.id) {

    //         return true;
    //     }
    // }

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

export async function getLikesByIdFromDB(id: number) {
    try {
        let queryStr = 'SELECT likes FROM users WHERE id = $1';
        const answerDB = await pool.query(queryStr, [id]);

        return answerDB.rows[0].likes;
    } catch (error) {
        console.log('getProfileByIdFromDB', error);
    }

    return {};
}

export async function setLikesByIdFromDB(id: number, arr: [number]) {
    try {
        let queryStr = 'UPDATE users SET likes = $1 WHERE id = $2';
        
        const answerDB = await pool.query(queryStr, [arr, id]);

        return answerDB.rowCount;
    } catch (error) {
        console.log('setLikesByIdFromDB', error);
    }

    return 0;
}
