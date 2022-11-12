import { IGetProfiles, IProfile, IQueryGetProfile, IQueryGetProfiles } from "../../interfaces/iprofiles";
import { getJWTFromDB, setTimecodeToDB } from "../query/auth";
import { getProfileByIdFromDB, getProfiles, setProfileByIdToDB } from "../query/profile";
import { getSignZodiac, testOverflowJWT } from "./utility";

const config = require('config');
const jwtToken = require('jsonwebtoken');

export async function querySetProfile(req, res) {
    try {
        const { profile } = req.body;

        const { jwt } = req.cookies;

        profile as IProfile;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (jwt && profile && testOverflowJWT(decode.exp)) {
            return res.status(400).json({ message: "Токен просрочен, повторите вход в систему!"});     
        }

        const token = getJWTFromDB(decode.userId);
        
        token.then((token) => {
            if (token !== jwt) {
                return res.status(400).json({ message:"Токен не валидный!" });
            }

            setTimecodeToDB(decode.userId);

            profile.signzodiac = getSignZodiac(profile.birthday, profile.monthofbirth);

            const newProfile = setProfileByIdToDB(decode.userId, profile);

            newProfile.then((profile) => {
                return res.status(200).json(profile);
            }).catch((error) => {
                console.log(error);

                return res.status(400).json({ message: "Произошла ошибка!"})
            })
        }).catch((error) => {
            console.log(error);

            return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
        })
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}

export async function querySetProfileShort(req, res) { 
    try {
        const { email, password } = req.body;

        const { jwt } = req.cookies;

        // const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        // if (getJWT(jwt) !== decode.userId) {
        //     return res.status(400).json({ message:"Токен не валидный!" });
        // }

        // let profile = getProfileFromDB(decode.userId);
        
        // profile.email = email;

        // const hashedPassword = await bcrypt.hash(password, 13);
        // profile.password = hashedPassword;

        // if (!setProfileShort(profile)) {
        //     return res.status(500).json({ message:"Профиль не изменен, возникли проблемы!" });
        // }

        // profile.jwt = '';
        // profile.email = '';
        // profile.password = '';
       
        return res.status(200).json([]);
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}

export async function queryGetProfile(req, res) { 
    try {
        const QueryGetProfiles:IQueryGetProfile = req.query;

        const { jwt } = req.cookies;
        const id = QueryGetProfiles.id;
        
        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (testOverflowJWT(decode.exp)) {
            return res.status(400).json({ message: "Токен просрочен, повторите вход в систему!"});     
        }

        const token = getJWTFromDB(decode.userId);
        
        token.then((token) => {
            if (token !== jwt) {
                return res.status(400).json({ message:"Токен не валидный!" });
            }

            setTimecodeToDB(decode.userId);

            let idNew = id;

            if (idNew == 0) {
                idNew = decode.userId;
            } 

            const profile = getProfileByIdFromDB(idNew);

            profile.then((profile) => {
                if ((id != 0) && Object.keys(profile).length > 0) {
                    const posId = profile.likes.indexOf(decode.userId);                
                    
                    if (posId === -1) {
                        profile.likes = [];
                    } else {
                        profile.likes = [decode.userId];
                    }
                } 

                return res.status(200).json(profile);
            }).catch((error) => {
                console.log(error);

                return res.status(400).json({ message: "Произошла ошибка!"})
            })
        }).catch((error) => {
            console.log(error);

            return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
        })
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}

export async function queryGetProfiles(req, res) { 
    try {
        const QueryGetProfiles:IQueryGetProfiles = req.query;

        const { jwt } = req.cookies;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (testOverflowJWT(decode.exp)) {
            return res.status(400).json({ message: "Токен просрочен, повторите вход в систему!"});     
        }

        const token = getJWTFromDB(decode.userId);
        
        token.then((token) => {
            if (token !== jwt) {
                return res.status(400).json({ message:"Токен не валидный!" });
            }

            setTimecodeToDB(decode.userId);

            const getProfilesVal:IGetProfiles = {
                jwt: jwt,
                id: QueryGetProfiles.id,
                startcount: QueryGetProfiles.startcount,
                amount: QueryGetProfiles.amount,
                filters: QueryGetProfiles.filters,
                users: []
            };

            const { filters, users } = QueryGetProfiles;
            
            if (filters) {
                const filtersParse = JSON.parse(filters as any);
                getProfilesVal.filters = filtersParse;
            }

            if (users) {
                const usersParse: any = users.split(',');
                getProfilesVal.users = usersParse;
            }
            
            getProfilesVal.id = decode.userId;
            
            const profiles = getProfiles(getProfilesVal);

            profiles.then((profiles) => {
                return res.status(200).json(profiles);
            }).catch((error) => {
                console.log(error);

                return res.status(400).json({ message: "Произошла ошибка!"})
            })
        }).catch((error) => {
            console.log(error);

            return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
        })
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}
