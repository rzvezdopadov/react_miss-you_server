import { getJWTFromDB } from "../query/auth";
import { getDialogByIdFromDB, getDialogsByIdFromDB } from "../query/dialogs";
import { testOverflowJWT } from "./utility";

const config = require('config');
const jwtToken = require('jsonwebtoken');

export async function querySetMessage(req, res) { 
    try {
        const { id1, id2, message } = req.body;

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

export async function queryGetDialog(req, res) { 
    try {


    } catch(e) {
        res.status(500).json({
            message:"Токен не валидный!"
        })
    }    
}

export async function queryGetDialogs(req, res) { 
    try {
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
