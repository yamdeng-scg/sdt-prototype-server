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

  end(socket, roomId) {
    socket.emit('end', { roomId: roomId });
  }

  saveHistory(socket, roomId, historyJson) {
    socket.emit('save-history', { roomId: roomId, data: historyJson });
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

  readMessage(socket, roomId, speakerId, startId, endId) {
    socket.emit('read-message', {
      roomId: roomId,
      speakerId: speakerId,
      startId: startId,
      endId: endId
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
