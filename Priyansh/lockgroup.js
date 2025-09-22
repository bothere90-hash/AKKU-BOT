const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "lockgroup",
    version: "1.0.0",
    hasPermssion: 0, // sabko 0 de, kyunki control hum manually UID se karenge
    credits: "YourName",
    description: "Lock group name with cooldown & owner UID check",
    commandCategory: "group",
    usages: "[on/off]",
    cooldowns: 5,
    allowedUID: ["61565630349063"] // yaha apna UID daal
};

let lastUsed = 0; // cooldown tracking

module.exports.run = async function ({ api, event, args }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const { allowedUID } = module.exports.config;

    // Check if UID allowed hai
    if (!allowedUID.includes(senderID)) {
        return api.sendMessage("❌ Sirf owner is command ko use kar sakta hai.", threadID, event.messageID);
    }

    // Cooldown check
    const now = Date.now();
    if (now - lastUsed < module.exports.config.cooldowns * 1000) {
        return api.sendMessage("⏳ Thoda ruk bhai, cooldown chal raha hai.", threadID, event.messageID);
    }
    lastUsed = now;

    // Argument check
    if (!args[0]) {
        return api.sendMessage("⚡ Use: lockgroup [on/off]", threadID, event.messageID);
    }

    const action = args[0].toLowerCase();
    if (action === "on") {
        api.changeGroupSetting(threadID, ["locked"], true, (err) => {
            if (err) return api.sendMessage("❌ Error locking group name.", threadID);
            api.sendMessage("🔒 Group name lock ho gaya!", threadID);
        });
    } else if (action === "off") {
        api.changeGroupSetting(threadID, ["locked"], false, (err) => {
            if (err) return api.sendMessage("❌ Error unlocking group name.", threadID);
            api.sendMessage("🔓 Group name unlock ho gaya!", threadID);
        });
    } else {
        return api.sendMessage("⚡ Use: lockgroup [on/off]", threadID, event.messageID);
    }
};￼Enter
