import { IGetProfiles, IProfile, IQueryGetProfile, IQueryGetProfiles, IRegistration } from "../interfaces/iprofiles";
import { createProfile, getDialogByIdFromDB, getDialogsByIdFromDB, getIdByEmailFromDB, getJWTFromDB, getLikesByIdFromDB, getPasswordByIdFromDB, getProfileByIdFromDB, getProfiles, setJWTToDB, setLikesByIdFromDB, setProfileByIdToDB, setTimecodeToDB } from "./queries";

const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

function testOverflowJWT(jwtExp: number = 0) {
    if (Math.round(Date.now()/1000) > jwtExp) return true;
    
    return false;
}

function getSignZodiac(birthday, monthofbirth) {
    if (!birthday && !monthofbirth) return 12

    if (((birthday > 20) && (monthofbirth === 3)) || ((birthday < 21) && (monthofbirth === 4))) return 0
    if (((birthday > 20) && (monthofbirth === 4)) || ((birthday < 22) && (monthofbirth === 5))) return 1
    if (((birthday > 21) && (monthofbirth === 5)) || ((birthday < 22) && (monthofbirth === 6))) return 2
    if (((birthday > 21) && (monthofbirth === 6)) || ((birthday < 23) && (monthofbirth === 7))) return 3 
    if (((birthday > 22) && (monthofbirth === 7)) || ((birthday < 22) && (monthofbirth === 8))) return 4 
    if (((birthday > 21) && (monthofbirth === 8)) || ((birthday < 24) && (monthofbirth === 9))) return 5 
    if (((birthday > 23) && (monthofbirth === 9)) || ((birthday < 24) && (monthofbirth === 10))) return 6 
    if (((birthday > 23) && (monthofbirth === 10)) || ((birthday < 23) && (monthofbirth === 11))) return 7 
    if (((birthday > 22) && (monthofbirth === 11)) || ((birthday < 23) && (monthofbirth === 12))) return 8 
    if (((birthday > 22) && (monthofbirth === 12)) || ((birthday < 21) && (monthofbirth === 1))) return 9 
    if (((birthday > 20) && (monthofbirth === 1)) || ((birthday < 20) && (monthofbirth === 2))) return 10 
    if (((birthday > 19) && (monthofbirth === 2)) || ((birthday < 21) && (monthofbirth === 3))) return 11
}

const date = Math.round(Date.now()/1000);

async function queryRegistration(req, res) { 
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некорректные данные при регистрации!"
            })
        }

        const reg:IRegistration = req.body;

        const candidate = getIdByEmailFromDB(reg.email);

        if (await candidate !== -1) {
            return res.status(400).json({message: "Такой пользователь уже существует!"})
        }

        if (!reg.name) {
            return res.status(400).json({message: "Не указанно имя!"})
        }

        const hashedPassword = await bcrypt.hash(reg.password, 13);

        const profile: IProfile = {
            id: 0,
            name: reg.name,
            latitude: 0,
            longitude: 0,
            location: "",
            likes: [],
            age: 0,
            birthday: 0,
            monthofbirth: 0,
            yearofbirth: 0,
            growth: 0,
            weight: 0,
            gender: reg.gender,
            gendervapor: reg.gendervapor,
            photomain: 0,
            photolink: [],
            signzodiac: 0,
            education: 0,
            fieldofactivity: 0,
            maritalstatus: 0,
            children: 0,
            religion: 0,
            smoke: 0,
            alcohol: 0,
            discription: "",
            profit: 0,
            interests: [],
            ilikecharacter: [],
            idontlikecharacter: [],
            filters: undefined
        };

        createProfile(profile);
        
        res.status(201).json({message: "Пользователь успешно создан!"})
    } catch (e) {
        res.status(500).json({
            message:"Что-то пошло не так при регистрации!",
            messageOther: e.message
        })
    }
}

async function queryLogin(req, res) { 
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некорректные данные при входе в систему!"
            })
        }

        const { email, password } = req.body;
        
        const idUser = getIdByEmailFromDB(email);

        idUser.then(async (id) => {
            if (id === -1) {
                return res.status(400).json({message: "Такой пользователь не существует!"})
            }

            const pass = getPasswordByIdFromDB(id);

            pass.then(async (pass) => {
                const isMatch = await bcrypt.compare(password, pass);

                if (!isMatch) {
                    return res.status(400).json({message: "Неверный пароль, попробуйте снова!"})
                }
                
                const token = await jwtToken.sign(
                    { userId: id },
                    config.get('jwtSecret'),
                    { expiresIn: '7d' }
                )

                const answerSetJWT = setJWTToDB(id, token);

                answerSetJWT.then((answer) => {

                    return res.status(200).json({ jwt: token, message: "Вы успешно авторизовались!"})
                }).catch((error) => {
                    console.log(error);

                    return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
                })
            }).catch((error)=>{
                console.log(error);

                return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
            });
        }).catch((error)=>{
            console.log(error);

            return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
        })
    } catch (e) {
        res.status(500).json({
            message:"Что-то пошло не так при аутентификации!"
        })
    }
}

async function querySetProfile(req, res) {
    try {
        const { 
            jwt, profile
        } = req.body;

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

async function querySetProfileShort(req, res) { 
    try {
        const { jwt, email, password } = req.body;

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

async function queryGetProfile(req, res) { 
    try {
        const QueryGetProfiles:IQueryGetProfile = req.query;

        const jwt = QueryGetProfiles.jwt;
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

async function queryGetProfiles(req, res) { 
    try {
        const QueryGetProfiles:IQueryGetProfiles = req.query;

        const jwt = QueryGetProfiles.jwt;

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

async function querySetLike(req, res) { 
    try {
        const { jwt, id } = req.body;

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

            let idNew = decode.userId;

            if (id !== 0) {
                idNew = id;
            } 

            const likes = getLikesByIdFromDB(idNew);

            likes.then((likes) => {
                if (id === 0) {
                    return res.status(200).json(likes);
                }

                const posLike = likes.indexOf(decode.userId);
                

                const commandDelete = 'delete';
                const commandAdded = 'added';
                let command = commandDelete;

                if (posLike === -1) {
                    likes.push(decode.userId);

                    command = commandAdded;
                } else {
                    likes.splice(posLike, 1);
                }

                const likeCommand = setLikesByIdFromDB(idNew, likes); 

                likeCommand.then((answer) => {
                    if (answer) {
                        if (command === commandAdded) {
                            likes = [decode.userId];
                        } else {
                            likes = [];
                        }

                        return res.status(200).json(likes);
                    }

                    return res.status(400).json({ message: "Произошла ошибка при лайке!"})
                }).catch((error) => {
                    console.log(error);

                    return res.status(400).json({ message: "Произошла ошибка!"})
                })                
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

async function querySetMessage(req, res) { 
    try {
        const { jwt, id1, id2, message } = req.body;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (testOverflowJWT(decode.exp)) {
            return res.status(400).json({ message: "Токен просрочен, повторите вход в систему!"});     
        }

        const token = getJWTFromDB(decode.userId);
        
        token.then((token) => {
            if (token !== jwt) {
                return res.status(400).json({ message:"Токен не валидный!" });
            }

            const dialog = getDialogByIdFromDB(id1, id2);

            dialog.then((dialog) => {
                console.log(dialog);
                
                

            }).catch((error) => {
                console.log(error);

                return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
            });
        }).catch((error) => {
            console.log(error);

            return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"});
        });
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }    
}

async function queryGetDialog(req, res) { 
    try {


    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }    
}

async function queryGetDialogs(req, res) { 
    try {
        const { jwt } = req.query;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (testOverflowJWT(decode.exp)) {
            return res.status(400).json({ message: "Токен просрочен, повторите вход в систему!"});     
        }

        const token = getJWTFromDB(decode.userId);
        
        token.then((token) => {
            if (token !== jwt) {
                return res.status(400).json({ message:"Токен не валидный!" });
            }

            const dialogs = getDialogsByIdFromDB(decode.userId);

            dialogs.then((dialogs) => {
                console.log(dialogs);

                return res.status(200).json(dialogs);              
            }).catch((error) => {
                console.log(error);

                return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"})
            });
        }).catch((error) => {
            console.log(error);

            return res.status(400).json({ message: "При авторизации произошла ошибка TBD!"});
        });
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }     
}



router.post(
    '/api/login',
    [
        check('email', 'Некоректный email').isEmail(),
        check('password', 'Некоректный пароль').isLength({min: 8, max: 30})
    ], 
    queryLogin
)

router.put(
    '/api/profile',
    [], 
    querySetProfile
)

router.put(
    '/api/profileshort',
    [], 
    querySetProfileShort
)

router.get(
    '/api/profile',
    [], 
    queryGetProfile
)

router.get(
    '/api/profiles',
    [], 
    queryGetProfiles
)

router.put(
    '/api/like',
    [], 
    querySetLike
)

router.put(
    '/api/setmessage',
    [], 
    querySetMessage
)

router.get(
    '/api/getdialog',
    [], 
    queryGetDialog
)

router.get(
    '/api/getdialogs',
    [], 
    queryGetDialogs
)

module.exports = router;
