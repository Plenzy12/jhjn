import Profile from "../../Tables/Profile";

export async function giveStarter(accountId: any) {
  const profiles = await Profile.findOne({ accountId: accountId });
  let profile = profiles?.profiles["athena"];
  let common_core = profiles?.profiles["common_core"];
  profile.stats.attributes.book_purchased = true;
  profile.stats.attributes.level = 100;
  profile.stats.attributes.book_level = 100;

  const items = ["AthenaDance:EID_IcedOut"];
  const Battlepass = await Bun.file("src/local/Season/s13/rewards.json").json();

  for (const item of items) {
    const lootList = { itemType: item, itemGuid: item, quantity: 1 };
    profile.items[item] = {
      quantity: 1,
      templateId: item,
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        variants: [],
        xp: 0,
      },
    };

    await profiles?.updateOne({
      $set: { "profiles.athena.items": profile.items },
    });
  }

  for (const items of Battlepass) {
    const item = items.Item;
    profile.items[item] = {
      quantity: 1,
      templateId: item,
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        variants: [],
        xp: 0,
      },
    };

    await profiles?.updateOne({
      $set: {
        "profiles.athena.items": profile.items,
        "profiles.athena.stats": profile.stats,
        "profiles.common_core": common_core,
      },
    });
  }
}
