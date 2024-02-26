// client side
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationurl } = require('./utils/message')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



// let count = 0;
// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.emit('countUpdate', count)

//     socket.on('increment', () => {
//         count++
//         // socket io not provide real time update
//         // socket.emit('countUpdate', count)
//         // real time update each usser
//         io.emit('countUpdate', count)
//     })
// });

io.on('connection', (socket) => {
    console.log('connected');

    // socket.emit('message', generateMessage('welcome'))
    // socket.broadcast.emit('message', generateMessage('A new user joined !'))

    // join room
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.Room)

        socket.emit('message', generateMessage('Admin', 'Welcome'))
        socket.broadcast.to(user.Room).emit('message', generateMessage('Admin', `${user.Username} has joined !`))

        io.to(user.Room).emit('roomData', {
            room: user.Room,
            users: getUsersInRoom(user.Room)
        })

        //  this callback used whrere client know to joined
        callback()
        // io.to.emit (emit every body in room),socket.broadcast.to.emit (used for specified user or room)
        //    socket.emit (specific client) , io.emit(every connected client) ,socket.broadcast.emit (expcept socket send every one)

    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        if (filter.isProfane(message)) {
            return callback('Profinity not allowed !')
        }

        io.to(user.Room).emit('message', generateMessage(user.Username, message))
        callback()
    })

    socket.on('sendlocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.Room).emit('locationMessage', generateLocationurl(user.Username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {

            // io.emit('message', generateMessage('Admin', `user has left`));
            io.to(user.Room).emit('message', generateMessage('Admin', `${user.Username} has left`))
            io.to(user.Room).emit('roomData', {
                room: user.Room,
                users: getUsersInRoom(user.Room)
            })
        }
    });



})
server.listen(port, console.log(`Server Listen on port ${port} 🎉 `))