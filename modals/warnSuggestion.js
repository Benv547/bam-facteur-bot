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

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('abusifWarning')
                    .setLabel('😡 Abusif')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warnWarning')
                    .setLabel('⚠️ Avertir')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('muteWarning')
                    .setLabel('🚫 Exclure')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('banWarning')
                    .setLabel('⛔️ Bannir')
                    .setStyle(ButtonStyle.Danger),
            );

        // Get guild channel by id
        const channel = interaction.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = interaction.guild.roles.cache.get(modRole);
        // Send message
        const message = await channel.send({ content: mod.toString() + ', le message suivant a été signalé pour la raison "**' + content + '**"\n' + warnMessage.url, embeds: warnMessage.embeds, components: [row] });

        // Get message sender in database
        const receiverId = await suggestionDB.get_id_user(message.id);

        // Save signalement in database
        await signalementDB.insertSignalement(warnMessage.id, sender.id, receiverId, content, null);
    },
};