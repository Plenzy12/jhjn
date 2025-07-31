import axios from "axios";
import type { Servers } from "../classes/matchmakingServers";
import Logger from "../../Logger";

export class GetMatchmakingServers {
  static async getServersAsync(): Promise<Servers[]> {
    const url = `${process.env.BaseUrl}:${process.env.MatchmakerPort}/matchmaker/api/v1/servers`;

    try {
      const response = await axios.get<Servers[]>(url);
      return response.data ?? [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Logger.error(
          `Request failed: ${error.response?.status} - ${error.message}`,
          error
        );
      } else {
        Logger.error(`Unexpected error: ${(error as Error).message}`, error);
      }
      return [];
    }
  }
}
