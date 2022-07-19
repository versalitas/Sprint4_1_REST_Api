const Users = require('mongoose').model("Users");

//get users from current room
const getUsers = (room) => {
    
    let result;
    try {
        let users = await Users.find({'room.roomId': room.roomId});
        // console.log('getUsers', users)
        users = users.map(({ _id, userName }) => ({ userId: _id, userName }));
        result = {status: 'success', users};

    } catch (err) {
        result =  {status:'error', message: err.message};
    }

    return result;
}

//joinroom
const joinRoom = (user, room) =>{

    let result;
    
    try {
        // console.log('joinRoom', room);

        // Push this user into the current room
        const currentUser = await Users.findOneAndUpdate(
            { _id: user.userId }, 
            { 'room.roomId': room.roomId, 'room.roomName': room.roomName }
            );

        // console.log("currentUser", currentUser)

        if (currentUser) {
            result = {status: 'success',
                      user: { userId: currentUser._id, userName: currentUser.userName },
                      oldRoom: currentUser.room
                     };
        } else {
            result = {status: 'fail', message: 'Error joining room'}
        }
    } catch (err) {
        result =  {status:'error', message: err.message};
    }

        return result;
}

//disconnect user from room
const  disconnectUser = (user) => {

    let result;

    try {
        
        // console.log('disconnectUser', user);

        const userDisconnect = await Users.findOneAndUpdate(
            { _id: user.userId }, 
            { 'room.roomId': null, 'room.roomName': null}
            );

        if (userDisconnect) {
            result = {status: 'success', 
                      user,
                      room: userDisconnect.room}
        } else {
            result = {status: 'fail', message: 'socketid for user disconnect not found'}
        }
    } catch (err) {
        result =  {status:'error', message: err.message};
    }

    return result;
}
module.exports = {getUsers, joinRoom, disconnectUser};