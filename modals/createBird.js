const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newBirdCategory} = require("../config.json");
const birdDB = require("../database/bird");
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require("../database/sticker");

module.exports = {
    name: 'createBird',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textBird');

        await interaction.reply({ content: 'Votre oiseau a été envoyé.', ephemeral: true });

        try {
            await bottle.createBird(interaction.guild, interaction.member.id, content, 0);
        } catch (e) {
            console.log(e);
        }
    },

    transformEmojiToDiscordEmoji: function (guild, text) {
        const emojis = text.match(/:[a-zA-Z0-9_]+:/g);
        if (emojis !== null) {
            for (const e of emojis) {
                text = text.replace(e, this.emojiToDiscordEmoji(guild, e));
            }
        }
        return text;
    },
    emojiToDiscordEmoji: function (guild, emoji) {
        const emojiName = emoji.replace(/:/g, '');
        const emojiFetched = guild.emojis.cache.find(emoji => emoji.name === emojiName);
        if (emojiFetched !== undefined) {
            return emojiFetched.toString();
        }
        return emoji;
    }
};