import type { FlairSocket } from "./utils/socketTypes";
import { XmppService } from "./utils/XmppServices";
import { Client } from "./utils/client";

export const xmppServer = Bun.serve<FlairSocket>({
  port: 70,
  fetch(request, server) {
    server.upgrade(request, { data: { socket: null } });
    return undefined;
  },
  websocket: {
    open(socket) {
      socket.data!.socket = socket;
    },

    close(socket) {
      if (!socket.data) return;

      socket.data.isLoggedIn = false;

      const index = XmppService.clients.findIndex((c) => c.socket === socket);
      if (index !== -1) {
        const client = XmppService.clients[index];
        XmppService.clients.splice(index, 1);
        console.log(`User has logged out: ${client.displayName}`);
      } else {
        console.log("XMPP connection closed (unknown client)");
      }
    },

    message(socket, message) {
      new Client(socket, message);
    },
  },
});

console.log("Running XMPP on port 70");
