import { v4 } from "uuid";
import Profile from "../Tables/Profile";

export async function levelUp(accountId: any) {
  const profiles = await Profile.findOne({ accountId });
  const profile = profiles?.profiles["athena"];
  const common_core = profiles?.profiles["common_core"];
  const rewards = (await Bun.file("src/local/Season/s15/rewards.json").json()) as {
    Item: string;
    Quantity: number;
    Tier: number;
  }[];

  const userLevel = profile.stats.attributes.book_level;
  let notification: any = [];
  for (const reward of rewards) {
    const item = reward.Item;
    const tier = reward.Tier;

    if (userLevel == tier) {
      profile.items[item] = {
        attributes: {
          favorite: false,
          item_seen: false,
          level: 0,
          max_level_bonus: 0,
          rnd_sel_cnt: 0,
          variants: [],
          xp: 0,
        },
        templateId: item,
      };

      notification.push({
        itemType: reward.Item,
        itemGuid: reward.Item,
        itemProfile: "athena",
        quantity: reward.Quantity,
      });
    }
  }

  // const giftboxId = v4();
  // common_core.items[giftboxId] = {
  //     templateId: "GiftBox:gb_makegood",
  //     attributes: {
  //         max_level_bonus: 0,
  //         fromAccountId: "Server",
  //         lootList: notification,
  //         params: {
  //             userMessage: "You have tiered up in Flair, enjoy!",
  //         },
  //     },
  //     quantity: 1,
  // };

  await profiles?.updateOne({
    $set: { "profiles.athena": profile },
  });
}
