import type { ServerWebSocket } from "bun";
import xmlparser from "xml-parser";
import open from "../states/open";
import auth from "../states/auth";
import iq from "../states/iq";
import type { FlairSocket } from "./socketTypes";
import { XmppService } from "./XmppServices";

export class Client {
  constructor(
    private socket: ServerWebSocket<FlairSocket>,
    private message: string | Buffer
  ) {
    if (typeof message !== "string") {
      return;
    }

    this.handle();
  }

  private async handle() {
    const xmlDoc = xmlparser(this.message as string);
    const { name } = xmlDoc.root;

    switch (name) {
      case "open":
        await open(this.socket, xmlDoc.root);
        break;
      case "auth":
        await auth(this.socket, xmlDoc.root);
        break;
      case "iq":
        await iq(this.socket, xmlDoc.root);
        break;
      case "close":
        break;
      default:

        break;
    }

    const d = this.socket.data!;
    const valid =
      !d.isLoggedIn &&
      d.isAuthenticated &&
      d.accountId &&
      d.displayName &&
      d.jid &&
      d.resource;

    if (valid) {
      XmppService.clients.push({
        socket: this.socket,
        accountId: d.accountId!,
        displayName: d.displayName!,
        token: d.token!,
        jid: d.jid!,
        resource: d.resource!,
        lastPresenceUpdate: {
          away: false,
          status: "{}",
        },
      });

      d.isLoggedIn = true;
      console.log(`User Logged in: ${d.displayName}`);
    }
  }
}
