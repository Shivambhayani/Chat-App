const users = [];

// adduser,removeuser , getuser ,getuserInroom

const addUser = ({ id, Username, Room }) => {
    Username = Username.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    // Validate the data
    if (!Username || !Room) {
        return {
            error: "Username and Room required"
        }
    }

    // Check for existing users
    const exstingUser = users.find((user) => {
        return user.Room === Room && user.Username === Username
    })

    // Valid username
    if (exstingUser) {
        return {
            error: "Username is in Use!"
        }
    }

    // store user
    const user = { id, Username, Room }
    users.push(user)
    return { user }
}

const getUser = (id) => {
    return index = users.find((user) => user.id === id)

}

const getUsersInRoom = (Room) => {
    Room = Room.trim().toLowerCase()
    return users.filter((user) => user.Room === Room)

}

// remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

addUser({
    id: 21,
    Username: "shivam",
    Room: " js"
})

// const res = removeUser(22)
// console.log(res);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}