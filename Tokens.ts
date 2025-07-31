import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { type IUser } from "../../Tables/User";
import path from "path";
import { config } from "dotenv";
import TokensModel from "../../Tables/Tokens";

config({ path: path.join(__dirname, "../../../config/.env") });

export interface TokenPayload {
  app: string;
  sub: string;
  dvid: number;
  mver: boolean;
  clid: string;
  dn: string;
  am: string;
  p: string;
  iai: string;
  sec: number;
  clsvc: string;
  t: string;
  ic: boolean;
  jti: string;
  creation_date: string;
  expires_in: number;
}

const CLIENT_SECRET =
  process.env.CLIENT_SECRET ||
  (() => {
    throw new Error("CLIENT_SECRET environment variable is required");
  })();

export default class TokenUtilities {
  private static async createToken(
    clientId: string,
    grantType: string,
    user: IUser,
    type: "access" | "refresh",
  ): Promise<string> {
    const payload: TokenPayload = {
      app: "fortnite",
      sub: user.accountId,
      dvid: Math.floor(Math.random() * 1e9),
      mver: false,
      clid: clientId,
      dn: user.username,
      am: type === "access" ? grantType : "refresh",
      p: Buffer.from(uuid()).toString("base64"),
      iai: user.accountId,
      sec: 1,
      clsvc: "fortnite",
      t: "s",
      ic: true,
      jti: uuid(),
      creation_date: new Date().toISOString(),
      expires_in: 1,
    };

    const expiresIn = type === "access" ? 4 * 3600 : 14 * 24 * 3600;
    const token = jwt.sign(payload, CLIENT_SECRET, { expiresIn });

    const permissions = (accountId: string) => [
      `account:api:public ALL
fortnite:cloudstorage:user:${accountId} READ
fortnite:cloudstorage:user:${accountId}:* READ
fortnite:cloudstorage:user:${accountId}:ClientSettings.sav ALL
fortnite:calendar READ
fortnite:cloudstorage:system READ
fortnite:cloudstorage:system:    READ
fortnite:matchmaking:session READ
fortnite:matchmaking:session:* READ
fortnite:matchmaking:session:*:invite CREATE DELETE
fortnite:matchmaking:session:*:join:${accountId} CREATE
fortnite:matchmaking:session:${accountId}:invite READ
fortnite:stats READ
fortnite:stats:* READ
xmpp:session:*:${accountId}`,
    ];

    await TokensModel.create({
      accountId: user.accountId,
      type: type + "token",
      token,
      permissions: permissions(user.accountId),
    });
    return token;
  }

  static async createAccessToken(
    clientId: string,
    grantType: string,
    user: IUser,
  ): Promise<string> {
    return this.createToken(clientId, grantType, user, "access");
  }

  static async createRefreshToken(clientId: string, user: IUser): Promise<string> {
    return this.createToken(clientId, "", user, "refresh");
  }
}
