import { Subject } from "rxjs/internal/Subject";
import { Socket } from "socket.io";
import { io } from ".";
import { getPeerId } from "./protect";

export interface Client {
  id: number,
  socket: Socket,
  peerId: string,
  roomId?: string,
}

let connectionIdCursor = 0;
export const clients: Client[] = [];

export const onConnectClient = new Subject<Client>();
export const onDisconnectClient = new Subject<Client>();

io.on('connection', (socket) => {
  socket.on('auth', ({ token }) => {
    try {
      const peerId = getPeerId(token);
      if (!peerId) throw new Error();
      const { roomId } = socket.handshake.query;

      const id = ++connectionIdCursor;
      const connection = { peerId, socket, id, roomId: roomId as string | undefined };
    
      clients.push(connection);
      onConnectClient.next(connection);
    
      socket.on("disconnect", () => {
        const index = clients.findIndex(connection => connection.id === id);
        
        if (index !== -1) {
          clients.splice(index, 1);
          onDisconnectClient.next(connection);
        }
      }); 
    } catch (e: any) {
      socket.emit('auth-error')
    }
  });
});
