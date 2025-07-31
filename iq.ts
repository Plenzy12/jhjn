import xmlbuilder from "xmlbuilder";
import xmlparser from "xml-parser";
import type { ServerWebSocket } from "bun";
import type { FlairSocket } from "../utils/socketTypes";
import { XmppService } from "../utils/XmppServices";

export default async function iq(socket: ServerWebSocket<FlairSocket>, root: xmlparser.Node) {
  const id = root.attributes.id;

  switch (id) {
    case "_xmpp_bind1": {
      const bindNode = root.children.find((n) => n.name === "bind");
      const resourceNode = bindNode?.children.find((n) => n.name === "resource");

      if (!resourceNode || !socket.data.accountId) return;

      const alreadyExists = XmppService.clients.find(c => c.accountId === socket.data.accountId);
      if (alreadyExists) {
        socket.send(
          xmlbuilder
            .create("close")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
            .toString()
        );
        return socket.close();
      }

      socket.data.resource = resourceNode.content;
      socket.data.jid = `${socket.data.accountId}@prod.ol.epicgames.com/${socket.data.resource}`;

      socket.send(
        xmlbuilder
          .create("iq")
          .attribute("to", socket.data.jid)
          .attribute("id", id)
          .attribute("type", "result")
          .element("bind")
          .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
          .element("jid", socket.data.jid)
          .up()
          .up()
          .toString()
      );
      break;
    }

    case "_xmpp_session1": {
      socket.send(
        xmlbuilder
          .create("iq")
          .attribute("to", socket.data.jid)
          .attribute("from", "prod.ol.epicgames.com")
          .attribute("id", id)
          .attribute("type", "result")
          .toString()
      );
      break;
    }

    default: {
      socket.send(
        xmlbuilder
          .create("iq")
          .attribute("to", socket.data.jid)
          .attribute("from", "prod.ol.epicgames.com")
          .attribute("id", id)
          .attribute("type", "result")
          .toString()
      );
    }
  }
}
