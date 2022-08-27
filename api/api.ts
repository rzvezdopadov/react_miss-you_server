import { type } from "os";
import { IProfile, IQueryGetProfiles, IRegistration } from "../interfaces/iprofiles";
import { fakeData } from "./fakedata";

const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

/* Fake database */
const userList = fakeData;
/* Fake database */

function getEmail(email: string) { // Search Email in DB
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].email === email) return userList[i].id;
    }
    
    return -1;
}

function getProfile(id: number) {
    let profile;

    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            profile = Object.assign({}, userList[i]);

            return profile;
        }
    }

    return profile;
}

function getProfiles(QueryGetProfiles: IQueryGetProfiles) {
    let profiles = [];
    let countProfiles = 0;
    const startPos = Number(QueryGetProfiles.startCount);
    const endPos = startPos + Number(QueryGetProfiles.amount);
    const { filters } = QueryGetProfiles;

    for (let i = 0; i < userList.length; i++) {
        if (
            (userList[i].location === filters.location) &&
            ((userList[i].signZodiac === filters.signZodiac) || (filters.signZodiac === 12)) &&
            (userList[i].age >= filters.ageStart) &&
            (userList[i].age <= filters.ageEnd) &&
            (userList[i].genderVapor === filters.genderVapor) &&
            ((userList[i].religion === filters.religion) || (filters.religion === 0)) &&
            ((userList[i].smoke === filters.smoke) || (filters.smoke === 0)) &&
            ((userList[i].alcohol === filters.alcohol) || (filters.alcohol === 0)) &&
            (userList[i].id !== QueryGetProfiles.id)
        ) {
            if (((countProfiles >= startPos) && (countProfiles <= endPos)) || (startPos === endPos)) {
                profiles.push(Object.assign({}, userList[i]));
                const posProfiles = profiles.length - 1;
                profiles[posProfiles].jwt = '';
                profiles[posProfiles].email = '';
                profiles[posProfiles].password = '';
            }
            
            countProfiles++;

            if ((startPos !== endPos) && (countProfiles > endPos)) {

                return profiles;
            }
        }
    }

    return profiles;
}

function setProfile(profile: IProfile) {
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

function setProfileShort(profile: IProfile) {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === profile.id) {
            userList[i].email = profile.email;
            userList[i].password = profile.password;

            return true;
        }
    }

    return false;
}

function getJWT(jwt: string) { // Search JWT in DB
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].jwt === jwt) return userList[i].id;
    }

    return -1;
}

function createProfile(profile: IProfile) { // Create base Profile in DB
    let id = 0;

    for (let i = 0; i < userList.length; i++) {
        id = Math.max(id, userList[i].id);
    }

    profile.id = id + 1;

    userList.push(profile);

    return true;
}

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

        const candidate = getEmail(reg.email);

        if (candidate !== -1) {
            return res.status(400).json({message: "Такой пользователь уже существует!"})
        }

        if (!reg.name) {
            return res.status(400).json({message: "Не указанно имя!"})
        }

        const hashedPassword = await bcrypt.hash(reg.password, 13);

        const profile: IProfile = {
            email: reg.email,
            password: hashedPassword,
            jwt: "",
            id: 0,
            name: reg.name,
            latitude: 0,
            longitude: 0,
            location: "",
            likes: [],
            age: 0,
            birthday: 0,
            monthOfBirth: 0,
            yearOfBirth: 0,
            gender: reg.gender,
            genderVapor: reg.genderVapor,
            photoMain: 0,
            photoLink: [],
            signZodiac: 0,
            education: 0,
            fieldOfActivity: 0,
            maritalStatus: 0,
            children: 0,
            religion: 0,
            rise: 0,
            smoke: 0,
            alcohol: 0,
            discription: "",
            profit: 0,
            interests: [],
            iLikeСharacter: [],
            iDontLikeСharacter: [],
            vapors: [],
            likePeople: [],
            dislikePeople: [],
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

        const idUser = getEmail(email);

        if (idUser === -1) {
            return res.status(400).json({message: "Такой пользователь не существует!"})
        }

        const isMatch = await bcrypt.compare(password, getProfile(idUser).password);

        if (!isMatch) {
            return res.status(400).json({message: "Неверный пароль, попробуйте снова!"})
        }

        const profile = getProfile(idUser);
        
        const token = await jwtToken.sign(
            { userId: profile.id },
            config.get('jwtSecret'),
            { expiresIn: '7d' }
        )
        
        profile.jwt = token;
        setProfile(profile);
        
        return res.status(200).json({ jwt: token, message: "Вы успешно авторизовались!"})
    } catch (e) {
        res.status(500).json({
            message:"Что-то пошло не так при аутентификации!"
        })
    }
}

async function querySetProfile(req, res) {
    try {
        const { 
            jwt, name, latitude, longitude, location, 
            birthday, monthOfBirth, yearOfBirth, 
            gender, genderVapor, photoMain, education,
            fieldOfActivity, maritalStatus, children,
            religion, rise, smoke, alcohol, discription,
            profit
        } = req.body;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (getJWT(jwt) !== decode.userId) {
            return res.status(400).json({ message:"Токен не валидный!" });
        }
            
        let profile:IProfile;

        profile = getProfile(decode.userId);

        profile.name = name;
        profile.latitude = latitude;
        profile.longitude = longitude;
        profile.location = location;
        profile.birthday = birthday;
        profile.monthOfBirth = monthOfBirth;
        profile.yearOfBirth = yearOfBirth;
        profile.gender = gender;
        profile.genderVapor = genderVapor;
        profile.photoMain = photoMain;
        profile.education = education;
        profile.fieldOfActivity = fieldOfActivity;
        profile.maritalStatus = maritalStatus;
        profile.children = children;
        profile.religion = religion;
        profile.rise = rise;
        profile.smoke = smoke;
        profile.alcohol = alcohol;
        profile.discription = discription;
        profile.profit = profit;
            
        if (!setProfile(profile)) {
            return res.status(500).json({ message:"Профиль не изменен, возникли проблемы!" });
        }

        profile.jwt = '';
        profile.email = '';
        profile.password = '';
       
        return res.status(200).json(profile);
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}

async function querySetProfileShort(req, res) { 
    try {
        const { jwt, email, password } = req.body;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (getJWT(jwt) !== decode.userId) {
            return res.status(400).json({ message:"Токен не валидный!" });
        }

        let profile = getProfile(decode.userId);
        
        profile.email = email;

        const hashedPassword = await bcrypt.hash(password, 13);
        profile.password = hashedPassword;

        if (!setProfileShort(profile)) {
            return res.status(500).json({ message:"Профиль не изменен, возникли проблемы!" });
        }

        profile.jwt = '';
        profile.email = '';
        profile.password = '';
       
        return res.status(200).json(profile);
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}

async function queryGetProfile(req, res) { 
    try {
        const { jwt, id} = req.body;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (getJWT(jwt) !== decode.userId) {
            return res.status(400).json({ message:"Токен не валидный!" });
        }

        let profile:IProfile;

        if (id === 0) {
            profile = getProfile(decode.userId);
        } else {
            profile = getProfile(id);
        }

        profile.jwt = '';
        profile.email = '';
        profile.password = '';

        if (!profile) return res.status(400).json({ message: "Профиль не найден, возможно он был удален!" });
        
        return res.status(200).json(profile);
    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }
}

async function queryGetProfiles(req, res) { 
    try {
        const QueryGetProfiles:IQueryGetProfiles = req.query;

        const decode = await jwtToken.verify(QueryGetProfiles.jwt, config.get('jwtSecret'));

        if (getJWT(QueryGetProfiles.jwt) !== decode.userId) {
            return res.status(400).json({ message:"Токен не валидный!" });
        }

        // Кошмарный костыль v
        const { filters } = QueryGetProfiles;
        const filtersParse = JSON.parse(filters as any);
        QueryGetProfiles.filters = filtersParse;
        QueryGetProfiles.id = decode.userId;
        // Кошмарный костыль ^

        const Profiles = getProfiles(QueryGetProfiles);
        
        return res.status(200).json(Profiles);
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

module.exports = router;
