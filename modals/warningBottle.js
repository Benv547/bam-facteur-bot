const bottle = require("../utils/bottleAction");
const {signalement, modRole} = require("../config.json");
const messageDB = require("../database/message");
const bottleDB = require("../database/bottle");
const signalementDB = require("../database/signalement");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'warningBottle',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textWarning');
        const sender = interaction.member;

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
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('historyWarning')
                    .setLabel('Historique')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Get content from database
        const warningContent = await messageDB.getContentOfMessage(interaction.message.id);

        // Get guild channel by id
        const channel = interaction.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = interaction.guild.roles.cache.get(modRole);
        const embed = createEmbeds.createFullEmbed('Nouveau signalement', warningContent + '\nRaison : ' + content, null, null, 0x2f3136, null);
        // Send message
        const message = await channel.send({ content: mod.toString(), embeds: [embed], components: [row] });


        // Fetch last message
        const lastMessageId = await messageDB.getLastMessageId(interaction.channel.id);
        const lastMessage = await interaction.channel.messages.fetch(lastMessageId);
        // Remove actions from last message
        await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: [] });

        // Get receiver from DB
        const receiver_id = await bottleDB.getReceiver(interaction.channel.id);

        // Save signalement to DB
        await signalementDB.insertSignalement(message.id, sender.id, receiver_id, content, interaction.channel.id);
    },
};