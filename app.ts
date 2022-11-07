import express from "express";
const config = require('config');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.use('/', require('./api/api'));

const PORT = config.get('port') || 5000;
const socketPORT = config.get('socketPort') || 8000; 

const http = require('http').Server(app);
const socketIO = require('socket.io')(http);

socketIO.on('connection', function(socket) {
    console.log('user connected');
    
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
})

socketIO.on('message', function(socket) {
    console.log('user message');
    
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
})

socketIO.on('like', function(socket) {
    console.log('user like');
    
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
})

http.listen(socketPORT, function() {
    console.log(`Socket started on port: "${socketPORT}"`);
 });

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Web started on port: "${PORT}"`);
        })
    } catch (e) {
        console.log("Server error with:",e.message);
    }
}

startServer();
