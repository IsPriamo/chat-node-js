class WebSockets {

  connection(client) {
    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      global.users = global.users.filter((user) => user.socketId !== client.id);
    });
    // add identity of user mapped to the socket id
    client.on("identity", (userId) => {
      global.users.push({
        socketId: client.id,
        userId: userId,
      });

      console.log(global.users);
    });
    // subscribe person to chat & other user as well
    client.on("subscribe", (room, otherUserId = "") => {
      const userSockets = global.users?.filter(
        (user) => user.userId === otherUserId
      );
      userSockets?.forEach((userInfo) => {
        const socketConn = global.io.sockets.connected(userInfo.socketId);
        console.log(socketConn);
        if (socketConn) {
          socketConn.join(room);
        }
      });

      client.join(room);
    });
    // mute a chat room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = global.users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.forEach((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }
}

export default new WebSockets();