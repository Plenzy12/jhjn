import type { ServerWebSocket } from "bun";

export interface FlairSocket {
  isLoggedIn?: boolean;
  isAuthenticated?: boolean;
  accountId?: string;
  token?: string;
  displayName?: string;
  jid?: string;
  resource?: string;
  socket?: ServerWebSocket<FlairSocket> | null;
}

export interface XmppClient {
  accountId: string;
  displayName: string;
  token: string;
  jid: string;
  resource: string;
  socket: ServerWebSocket<FlairSocket>;
  lastPresenceUpdate: {
    away: boolean;
    status: string;
  };
}
