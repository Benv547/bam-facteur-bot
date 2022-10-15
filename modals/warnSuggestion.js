const bottle = require("../utils/bottleAction");
const {signalement, modRole} = require("../config.json");
const messageDB = require("../database/message");
const bottleDB = require("../database/bottle");
const signalementDB = require("../database/signalement");
const suggestionDB = require("../database/suggestion");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'warnSuggestion',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('warnSuggestion');
        const sender = interaction.member;
        const warnMessage = interaction.message;

        await interaction.reply({ content: 'Votre signalement a été envoyé.', ephemeral: true });

        // Get guild channel by id
        const channel = interaction.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = interaction.guild.roles.cache.get(modRole);
        // Send message
        const message = await channel.send({ content: mod.toString() + ', le message suivant a été signalé pour la raison "**' + content + '**"\n' + warnMessage.url, embeds: warnMessage.embeds });

        // Get message sender in database
        const receiverId = await suggestionDB.get_id_user(warnMessage.id);

        // Save signalement in database
        await signalementDB.insertSignalement(warnMessage.id, sender.id, receiverId, content, null);
    },
};