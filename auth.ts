import type { ServerWebSocket } from "bun";
import type { FlairSocket } from "../utils/socketTypes";
import xmlparser from "xml-parser";
import xmlbuilder from "xmlbuilder";
import User from "../../Tables/User";
import { XmppService } from "../utils/XmppServices";

export default async function auth(socket: ServerWebSocket<FlairSocket>, node: xmlparser.Node) {
  if (!node?.content) return socket.close(1008, "Invalid XML");

  const decoded = Buffer.from(node.content, "base64").toString("utf-8");
  const fields = decoded.split("\u0000");
  const accountId = fields[1];

  if (!accountId || fields.length !== 3) return socket.close();

  if (XmppService.clients.some((c) => c.accountId === accountId)) {
    return socket.close();
  }

  const user = await User.findOne({ accountId: accountId });
  if (!user || user.banned) {
    socket.data.isAuthenticated = false;
    return socket.close();
  }

  socket.data.accountId = user.accountId;
  socket.data.displayName = user.username;
  socket.data.isAuthenticated = true;

  console.log(`User Logged In: ${user.username}`);

  socket.send(
    xmlbuilder.create("success").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl").toString(),
  );
}
