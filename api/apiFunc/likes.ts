import { getJWTFromDB, setTimecodeToDB } from "../query/auth";
import { getLikesByIdFromDB, setLikesByIdFromDB } from "../query/likes";
import { testOverflowJWT } from "./utility";

const config = require('config');
const jwtToken = require('jsonwebtoken');

export async function querySetLike(req, res) { 
    try {
        const { id } = req.body;

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
