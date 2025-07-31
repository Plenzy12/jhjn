import Profile from "../../Tables/Profile";

export async function giveOG(accountId: any) {
  const profiles = await Profile.findOne({ accountId: accountId });
  let profile = profiles?.profiles["athena"];
  if (!profile) return;

  const characters: Record<string, any> = {
    "AthenaCharacter:CID_017_Athena_Commando_M": {
      templateId: "AthenaCharacter:CID_017_Athena_Commando_M",
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        xp: 0,
        variants: [],
        favorite: false,
      },
      quantity: 1,
    },
    "AthenaCharacter:CID_028_Athena_Commando_F": {
      templateId: "AthenaCharacter:CID_028_Athena_Commando_F",
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        xp: 0,
        variants: [
          {
            channel: "Material",
            active: "Mat1",
            owned: ["Mat1", "Mat2"],
          },
        ],
        favorite: false,
      },
      quantity: 1,
    },
    "AthenaCharacter:CID_029_Athena_Commando_F_Halloween": {
      templateId: "AthenaCharacter:CID_029_Athena_Commando_F_Halloween",
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        xp: 0,
        variants: [
          {
            channel: "Material",
            active: "Mat1",
            owned: ["Mat1", "Mat2", "Mat3"],
          },
        ],
        favorite: false,
      },
      quantity: 1,
    },
    "AthenaCharacter:CID_030_Athena_Commando_M_Halloween": {
      templateId: "AthenaCharacter:CID_030_Athena_Commando_M_Halloween",
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        xp: 0,
        variants: [
          {
            channel: "ClothingColor",
            active: "Mat0",
            owned: ["Mat0", "Mat1", "Mat2", "Mat3", "Mat4"],
          },
          {
            channel: "Parts",
            active: "Stage1",
            owned: ["Stage1", "Stage2"],
          },
        ],
        favorite: false,
      },
      quantity: 1,
    },
  };

  const pickaxes: Record<string, any> = {
    "AthenaPickaxe:HalloweenScythe": {
      templateId: "AthenaPickaxe:HalloweenScythe",
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        xp: 0,
        variants: [],
        favorite: false,
      },
      quantity: 1,
    },
    "AthenaPickaxe:Pickaxe_Lockjaw": {
      templateId: "AthenaPickaxe:Pickaxe_Lockjaw",
      attributes: {
        max_level_bonus: 0,
        level: 1,
        item_seen: false,
        xp: 0,
        variants: [],
        favorite: false,
      },
      quantity: 1,
    },
  };

  const allItems = { ...characters, ...pickaxes };

  for (const [itemId, itemData] of Object.entries(allItems)) {
    profile.items[itemId] = itemData;
  }

  await profiles?.updateOne({
    $set: { "profiles.athena.items": profile.items },
  });
}
