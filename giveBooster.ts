import Profile from "../../Tables/Profile";

export async function giveBooster(accountId: any) {
  const profiles = await Profile.findOne({ accountId: accountId });
  let profile = profiles?.profiles["athena"];
  let common_core = profiles?.profiles["common_core"];

  profile.items["AthenaCharacter:CID_660_Athena_Commando_F_BandageNinjaBlue"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaCharacter:CID_660_Athena_Commando_F_BandageNinjaBlue",
  };

  profile.items["AthenaCharacter:CID_660_Athena_Commando_F_BandageNinjaBlue"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaCharacter:CID_660_Athena_Commando_F_BandageNinjaBlue",
  };

  profile.items["AthenaPickaxe:Pickaxe_ID_338_BandageNinjaBlue1H"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaPickaxe:Pickaxe_ID_338_BandageNinjaBlue1H",
  };

  profile.items["AthenaBackPack:BID_452_BandageNinjaBlue"] = {
    attributes: {
      favorite: false,
      item_seen: false,
      level: 0,
      max_level_bonus: 0,
      rnd_sel_cnt: 0,
      variants: [],
      xp: 0,
    },
    templateId: "AthenaBackPack:BID_452_BandageNinjaBlue",
  };

  common_core.items["Currency:MtxPurchased"].quantity += 1500;

  await profiles?.updateOne({
    $set: {
      "profiles.athena.items": profile.items,
      "profiles.common_core.items": common_core.items,
    },
  });
}
