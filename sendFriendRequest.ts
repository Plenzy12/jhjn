import User from "../../Tables/User";
import { Friends, type Friend } from "../../Tables/Friends";
import { SendMessageToId } from "./SendMessageToId";

export async function sendFriendRequest(accountId: string, friendId: string): Promise<boolean> {
  const [frienduser, friendInList, user, friend] = await Promise.all([
    Friends.findOne({ accountId: accountId }),
    Friends.findOne({ accountId: friendId }),
    User.findOne({ accountId: accountId }),
    User.findOne({ accountId: friendId }),
  ]);

  if (!frienduser || !friendInList || !user || !friend || user.banned || friend.banned) {
    console.log("User or friend not found or banned.");
    return false;
  }

  const existingOutgoing = frienduser.friends.outgoing.find(
    (outgoing) => outgoing.accountId === friendId,
  );

  const existingIncoming = friendInList.friends.incoming.find(
    (incoming) => incoming.accountId === accountId,
  );

  const result1 = await Friends.updateOne(
    { accountId: frienduser.accountId },
    {
      $push: {
        "friends.outgoing": {
          accountId: friend.accountId,
          createdAt: new Date().toISOString(),
          alias: "",
        },
      },
    },
  ).catch((err) => {
    console.error("Error updating outgoing list:", err);
    return null;
  });

  const result2 = await Friends.updateOne(
    { accountId: friendInList.accountId },
    {
      $push: {
        "friends.incoming": {
          accountId: user.accountId,
          createdAt: new Date().toISOString(),
          alias: "",
        },
      },
    },
  ).catch((err) => {
    console.error("Error updating incoming list:", err);
    return null;
  });

  SendMessageToId(
    JSON.stringify({
      payload: {
        accountId: friend.accountId,
        status: "PENDING",
        direction: "OUTBOUND",
        created: new Date().toISOString(),
        favorite: false,
      },
      type: "com.epicgames.friends.core.apiobjects.Friend",
      timestamp: new Date().toISOString(),
    }),
    user.accountId,
  );

  SendMessageToId(
    JSON.stringify({
      payload: {
        accountId: user.accountId,
        status: "PENDING",
        direction: "INBOUND",
        created: new Date().toISOString(),
        favorite: false,
      },
      type: "com.epicgames.friends.core.apiobjects.Friend",
      timestamp: new Date().toISOString(),
    }),
    friend.accountId,
  );

  return true;
}
