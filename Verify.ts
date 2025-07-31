import Tokens from "../Tables/Tokens";

export default async function verifyAuth(c: any, next: any) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Invalid Token!" }, 401);
  }

  const tokenStr = authHeader.split(" ").pop().trim();

  const token = await Tokens.findOne({ token: tokenStr });

  if (!token) {
    return c.json({ error: "Invalid Token!" }, 401);
  }

  await next();
}
