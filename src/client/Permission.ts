const Permissions: any = {
  createInstantInvite: 1,
  kickMembers: 1 << 1,
  banMembers: 1 << 2,
  administrator: 1 << 3,
  manageChannels: 1 << 4,
  manageGuild: 1 << 5,
  addReactions: 1 << 6,
  viewAuditLogs: 1 << 7,
  voicePrioritySpeaker: 1 << 8,
  stream: 1 << 9,
  readMessages: 1 << 10,
  sendMessages: 1 << 11,
  sendTTSMessages: 1 << 12,
  manageMessages: 1 << 13,
  embedLinks: 1 << 14,
  attachFiles: 1 << 15,
  readMessageHistory: 1 << 16,
  mentionEveryone: 1 << 17,
  externalEmojis: 1 << 18,
  viewGuildAnalytics: 1 << 19,
  voiceConnect: 1 << 20,
  voiceSpeak: 1 << 21,
  voiceMuteMembers: 1 << 22,
  voiceDeafenMembers: 1 << 23,
  voiceMoveMembers: 1 << 24,
  voiceUseVAD: 1 << 25,
  changeNickname: 1 << 26,
  manageNicknames: 1 << 27,
  manageRoles: 1 << 28,
  manageWebhooks: 1 << 29,
  manageEmojis: 1 << 30,
  all: 0b1111111111111111111111111111111,
  allGuild: 0b1111100000010000000000010111111,
  allText: 0b0110000000001111111110001010001,
  allVoice: 0b0110011111100000000001100010001
}

class Permission {
  allow: any

  constructor (allow: any) {
    this.allow = allow
  }

  /*** Check if this permission allows a specific permission
  * @arg {String} permission The name of the permission. [A full list of permission nodes can be found on the docs reference page](/Eris/docs/reference)
  * @returns {Boolean} Whether the permission allows the specified permission
  */
  has (permission: any) {
    return !!(this.allow & Permissions[permission])
  }
}

export default Permission
