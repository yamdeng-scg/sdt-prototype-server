class SocketService {
  join(socket, roomId, speakerId) {
    return new Promise((resolve, reject) => {
      socket.emit(
        'join',
        { roomId: roomId, speakerId: speakerId },
        (socketIoCallbackResponse, err) => {
          if (err) {
            reject({ message: 'socket 오류' });
          } else {
            resolve(socketIoCallbackResponse);
          }
        }
      );
    });
  }

  sendMessage(socket, messageInfo) {
    socket.emit('message', messageInfo);
  }

  deleteMessage(socket, messageId) {
    return new Promise((resolve, reject) => {
      socket.emit(
        'delete-message',
        { id: messageId },
        (socketIoCallbackResponse, err) => {
          if (err) {
            reject({ message: 'socket 오류' });
          } else {
            resolve(socketIoCallbackResponse);
          }
        }
      );
    });
  }

  sendEvent(socket, eventInfo) {
    socket.emit('send-event', eventInfo);
  }

  readMessage(socket, roomId, speakerId, startId, endId) {
    socket.emit('read-message', {
      roomId: roomId,
      speakerId: speakerId,
      startId: startId,
      endId: endId
    });
  }

  leave(socket, roomId) {
    socket.emit('leave', {
      roomId: roomId
    });
  }

  moreMessage(socket, roomId, startId) {
    socket.emit('message-list', {
      roomId: roomId,
      startId: startId
    });
  }
}

export default new SocketService();
