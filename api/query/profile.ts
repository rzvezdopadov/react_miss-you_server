import { IGetProfiles, IProfile } from "../../interfaces/iprofiles";
import { poolDB } from "./config";

const fieldProfile = 'id, timecode, name, latitude, longitude, location, ' +
'likes, age, birthday, monthofbirth, yearofbirth, growth, weight, ' +
'gender, gendervapor, photomain, photolink, signzodiac, ' +
'education, fieldofactivity, maritalstatus, children, religion, ' +
'smoke, alcohol, discription, profit, interests, ' +
'ilikeCharacter, idontlikeCharacter, raiting';

const fieldFilters = 'location, signzodiac, agestart, ageend, ' +
'growthstart, growthend, weightstart, weightend, gendervapor, ' +
'religion, smoke, alcohol, interests'
;

export async function getProfileByIdFromDB(id: number) {
    try {
        let queryStr = 'SELECT ' + fieldProfile + ' FROM users WHERE id = $1';
        const answerDB = await poolDB.query(queryStr, [id]);

        if (!answerDB.rows[0]) return {}

        let queryStrFilters = 'SELECT ' + fieldFilters + ' FROM filters WHERE id = $1';
        const answerDBFilters = await poolDB.query(queryStrFilters, [id]);

        if (!answerDBFilters.rows[0]) return {}

        answerDB.rows[0].filters = answerDBFilters.rows[0];

        return answerDB.rows[0];
    } catch (error) {
        console.log('getProfileByIdFromDB', error);
    }

    return {};
}

const fieldProfileShort = 'id, timecode, name, age, gender, photomain, photolink, interests, raiting';

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

            let gendervapor = filters.gendervapor;

            if (filters.gendervapor === 0) {
                gendervapor = 1;
            } else if (filters.gendervapor === 1) {
                gendervapor = 0;
            }
            
            answerDB = await poolDB.query(queryStr, [
                filters.location, 
                filters.signzodiac,
                filters.agestart, filters.ageend,
                filters.growthstart, filters.growthend,
                filters.weightstart, filters.weightend,
                gendervapor,
                filters.religion,
                filters.smoke,
                filters.alcohol,
                QueryGetProfiles.id
            ]);
        } else if (users) {
            if (users.length === 0) {
                return [];
            } else {
                users.forEach((value) => {
                    queryStr += '(id = ' + value + ') OR ';
                })
            }

            queryStr = queryStr.slice(0, -3);
            answerDB = await poolDB.query(queryStr);
        }

        let profiles = answerDB.rows;

        if (profiles.length > 1) {
            profiles = profiles.sort((a, b)=>  (b.raiting - a.raiting));
        }

        return profiles;
    } catch (error) {
        console.log('getProfiles', error);
    }

    return [];
}

export async function getProfilesForDialogs(users: Array<number>) {
    try {
        let answerDB = { rows: [] };

        let queryStr = 'SELECT id, name, age, photomain, photolink FROM users WHERE ';

         if (users) {
            if (users.length === 0) {
                return [];
            } else {
                users.forEach((value) => {
                    queryStr += '(id = ' + value + ') OR ';
                })
            }

            queryStr = queryStr.slice(0, -3);

            answerDB = await poolDB.query(queryStr);
        }
            
        return answerDB.rows;
    } catch (error) {
        console.log('getProfilesForDialogs', error);
    }

    return [];
}

export async function setProfileByIdToDB(id: number, profile: IProfile) {
    try {
        let queryStrProfile = 'UPDATE users SET ';
        
        queryStrProfile += 'name = $2, location = $3, age = $4, ';
        queryStrProfile += 'birthday = $5, monthofbirth = $6, yearofbirth = $7, ';
        queryStrProfile += 'growth = $8, weight = $9, ';
        queryStrProfile += 'gender = $10, gendervapor = $11, ';
        queryStrProfile += 'signzodiac = $12, education = $13, ';
        queryStrProfile += 'fieldofactivity = $14, maritalstatus = $15, ';
        queryStrProfile += 'children = $16, religion = $17, ';
        queryStrProfile += 'smoke = $18, alcohol = $19, ';
        queryStrProfile += 'discription = $20, profit = $21, ';
        queryStrProfile += 'interests = $22, ';
        queryStrProfile += 'ilikecharacter = $23, idontlikecharacter = $24 ';
        queryStrProfile += 'WHERE id = $1';

        const answerDBProfile = await poolDB.query(queryStrProfile, [id,
            profile.name, profile.location, profile.age,
            profile.birthday, profile.monthofbirth, profile.yearofbirth,  
            profile.growth, profile.weight,
            profile.gender, profile.gendervapor,
            profile.signzodiac, profile.education,
            profile.fieldofactivity, profile.maritalstatus,
            profile.children, profile.religion,
            profile.smoke, profile.alcohol,
            profile.discription, profile.profit,
            profile.interests,
            profile.ilikecharacter, profile.idontlikecharacter,         
        ]);

        let queryStrFilters = 'UPDATE filters SET ';

        queryStrFilters += 'location = $2, ';
        queryStrFilters += 'agestart = $3, ageend = $4, ';
        queryStrFilters += 'growthstart = $5, growthend = $6, ';
        queryStrFilters += 'weightstart = $7, weightend = $8, ';
        queryStrFilters += 'signzodiac = $9, ';
        queryStrFilters += 'gendervapor = $10, ';
        queryStrFilters += 'religion = $11, ';
        queryStrFilters += 'smoke = $12, ';
        queryStrFilters += 'alcohol = $13, ';
        queryStrFilters += 'interests = $14 ';
        queryStrFilters += 'WHERE id = $1';

        const answerDBFilters = await poolDB.query(queryStrFilters, [id, 
            profile.filters.location, 
            profile.filters.agestart, profile.filters.ageend,
            profile.filters.growthstart, profile.filters.growthend,
            profile.filters.weightstart, profile.filters.weightend,
            profile.filters.signzodiac, 
            profile.filters.gendervapor,
            profile.filters.religion,
            profile.filters.smoke,
            profile.filters.alcohol,
            profile.filters.interests,
        ]);
    } catch (error) {
        console.log('setProfileByIdToDB:', error);
    }

    let newProfile = {};

    try {
        newProfile = await getProfileByIdFromDB(id);
    } catch (error) {
        console.log('setProfileByIdToDB get:', error);
    }

    return newProfile;
}

export function setProfileShort(profile: IProfile) {
    // for (let i = 0; i < userList.length; i++) {
    //     if (userList[i].id === profile.id) {

    //         return true;
    //     }
    // }

    return false;
}
