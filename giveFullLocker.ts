import Profile from "../../Tables/Profile";
import path from "path";

export async function giveFullLocker(accountId: any) {
  const profiles = await Profile.findOne({ accountId: accountId });
  let profile = profiles?.profiles["athena"];

  const allItems = require(path.join(__dirname, "..", "..", "local", "Utils", "allCosmetics.json"));
  profile.items = { ...profile.items, ...allItems };

  await profiles?.updateOne({
    $set: { "profiles.athena.items": profile.items },
  });
}
