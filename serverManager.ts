import type { Servers } from "./classes/matchmakingServers";
import { GetMatchmakingServers } from "./requests/getMatchmakingServers";

export class ServerManager {
  static async getServerBySessionIdAsync(
    sessionId: string
  ): Promise<Servers | undefined> {
    const servers = await GetMatchmakingServers.getServersAsync();
    return servers.find((server) => server.sessionId === sessionId);
  }
}
