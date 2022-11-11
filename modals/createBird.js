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
};