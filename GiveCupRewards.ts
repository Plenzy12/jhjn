import Profile from "../../Tables/Profile";

export async function giveCupRewards(accountId: any) {
  const profiles = await Profile.findOne({ accountId: accountId });
  let profile = profiles?.profiles["athena"];
  let common_core = profiles?.profiles["common_core"];

  profile.items["AthenaCharacter:CID_715_Athena_Commando_F_TwinDark"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaCharacter:CID_715_Athena_Commando_F_TwinDark",
  };

  profile.items["AthenaPickaxe:Pickaxe_ID_014_WinterCamo"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaPickaxe:Pickaxe_ID_014_WinterCamo",
  };

  profile.items["AthenaGlider:Glider_ID_110_TeriyakiFish"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaGlider:Glider_ID_110_TeriyakiFish",
  };

  await profiles?.updateOne({
    $set: {
      "profiles.athena.items": profile.items,
      "profiles.common_core.items": common_core.items,
    },
  });
}
