import User from "../../Tables/User";
import { Friends, type Friend } from "../../Tables/Friends";
import { SendMessageToId } from "./SendMessageToId";

export async function acceptFriendRequest(accountId: string, friendId: string): Promise<boolean> {
  const [frienduser, friendInList, user, friend] = await Promise.all([
    Friends.findOne({ accountId: accountId }),
    Friends.findOne({ accountId: friendId }),
    User.findOne({ accountId: accountId }),
    User.findOne({ accountId: friendId }),
  ]);

  if (!frienduser || !friendInList || !user || !friend || user.banned || friend.banned) {
    return false;
  }

  const incomingFriendsIndex = frienduser.friends.incoming.findIndex(
    (incoming) => incoming.accountId === friend.accountId,
  );
  const outgoingFriendsIndex = friendInList.friends.outgoing.findIndex(
    (outgoing) => outgoing.accountId === user.accountId,
  );

  if (incomingFriendsIndex === -1 || outgoingFriendsIndex === -1) {
    return false;
  }

  await Friends.updateOne(
    { accountId: frienduser.accountId },
    { $pull: { "friends.incoming": { accountId: friend.accountId } } },
  );

  await Friends.updateOne(
    { accountId: friendInList.accountId },
    { $pull: { "friends.outgoing": { accountId: user.accountId } } },
  );

  await Friends.updateOne(
    { accountId: frienduser.accountId },
    {
      $push: {
        "friends.accepted": {
          accountId: friend.accountId,
          createdAt: new Date().toISOString(),
          alias: "",
        },
      },
    },
  );

  await Friends.updateOne(
    { accountId: friendInList.accountId },
    {
      $push: {
        "friends.accepted": {
          accountId: user.accountId,
          createdAt: new Date().toISOString(),
          alias: "",
        },
      },
    },
  );

  SendMessageToId(
    JSON.stringify({
      payload: {
        accountId: friend.accountId,
        status: "ACCEPTED",
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
        status: "ACCEPTED",
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
