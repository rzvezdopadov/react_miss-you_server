import { json } from "body-parser";
import { IProfile } from "../interfaces/iprofiles";
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
    let profile:IProfile;

    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            profile = Object.assign(userList[i]);

            return profile;
        }
    }

    return profile;
}

function getJWT(jwt: string) { // Search JWT in DB
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].jwt === jwt) return i;
    }

    return -1;
}

function setJWT(id: number, jwt: string) { // Set JWT in DB
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            userList[i].jwt === jwt;

            return true;
        }  
    }

    return false;
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

        const { email, password, name, gender, genderVapor } = req.body;

        const candidate = getEmail(email);

        if (candidate !== -1) {
            return res.status(400).json({message: "Такой пользователь уже существует!"})
        }

        if (!name) {
            return res.status(400).json({message: "Не указанно имя!"})
        }

        const hashedPassword = await bcrypt.hash(password, 13);

        const profile: IProfile = {
            email: email,
            password: hashedPassword,
            jwt: "",
            id: 0,
            name: name,
            latitude: 0,
            longitude: 0,
            location: "",
            likes: 0,
            age: 0,
            birthday: 0,
            monthOfBirth: 0,
            yearOfBirth: 0,
            gender: gender,
            genderVapor: genderVapor,
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
            iLikeСharacter: [],
            iDontLikeСharacter: []
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
        
        return res.status(200).json({ jwt: token, message: "Вы успешно авторизовались!"})
    } catch (e) {
        res.status(500).json({
            message:"Что-то пошло не так при регистрации!"
        })
    }
}

async function querySetProfile(req, res) { 

    return res.status(200).json({message: "Вы успешно авторизовались!"});
}

async function querySetProfileShort(req, res) { 

    return res.status(200).json({message: "Вы успешно авторизовались!"});
}

async function queryGetProfile(req, res) { 
    try {
        const { jwt, id} = req.body;

        const decode = await jwtToken.verify(jwt, config.get('jwtSecret'));

        if (getJWT(jwt) === decode.userId) {
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

    return res.status(200).json({ message: "Вы успешно авторизовались!" });
}

router.post(
    '/api/registration',
    [
        check('email', 'Некоректный email').isEmail(),
        check('password', 'Некоректный пароль').isLength({min: 8, max: 30})
    ], 
    queryRegistration
)

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
