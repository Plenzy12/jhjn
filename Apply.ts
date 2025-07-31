export async function applyProfileChanges(profile: any, profileId: string, profiles: any) {
  let ApplyProfileChanges = [
    {
      changeType: "fullProfileUpdate",
      profile: profile,
    },
  ];

  let BaseRevision = profile.rvn;
  profile.rvn += 1;
  profile.commandRevision += 1;
  profile.updated = new Date().toISOString();

  await profiles.updateOne({
    $set: { [`profiles.${profileId}`]: profile },
  });

  return {
    profileRevision: profile.rvn || 0,
    profileId: profileId,
    profileChangesBaseRevision: BaseRevision,
    profileChanges: ApplyProfileChanges,
    profileCommandRevision: profile.commandRevision || 0,
    serverTime: new Date().toISOString(),
    multiUpdate: [],
    responseVersion: 1,
  };
}
