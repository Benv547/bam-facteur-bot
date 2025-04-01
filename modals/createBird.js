const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const birdDB = require("../database/bird");
const createEmbeds = require("../utils/createEmbeds");

let semaphore = [];

module.exports = {
    name: 'createBird',
    async execute(interaction) {

        if (global.semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'Vous avez déjà un oiseau en cours de création !', ephemeral: true });
        }

        try {
            global.semaphore.push(interaction.user.id);

            const content = interaction.fields.getTextInputValue('textBird');
            if (content.trim() === '') {
                return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
            }

            await interaction.reply({ content: 'Votre oiseau a été envoyé.', ephemeral: true });

            try {
                await bottle.createBird(interaction.guild, interaction.member.id, content, 0);
            } catch (e) {
                console.log(e);
            }
        } finally {
            global.semaphore = global.semaphore.filter(item => item !== interaction.user.id);
        }
    },
};