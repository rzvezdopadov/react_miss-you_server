import express from "express";
const config = require('config');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.use('/', require('./api/api'));

const PORT = config.get('port') || 5000;

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`App started on port: "${PORT}"`);
        })
    } catch (e) {
        console.log("Server error with:",e.message);
    }
}

startServer();
