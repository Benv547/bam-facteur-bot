const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newBirdCategory} = require("../config.json");
const birdDB = require("../database/bird");
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require("../database/sticker");

let semaphore = [];

module.exports = {
    name: 'createBird',
    async execute(interaction) {

        if (semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'Vous avez déjà un oiseau en cours de création !', ephemeral: true });
        }

        semaphore.push(interaction.user.id);

        const content = interaction.fields.getTextInputValue('textBird');

        await interaction.reply({ content: 'Votre oiseau a été envoyé.', ephemeral: true });

        try {
            await bottle.createBird(interaction.guild, interaction.member.id, content, 0);
        } catch (e) {
            console.log(e);
        }

        semaphore = semaphore.filter(item => item !== interaction.user.id);
    },
};