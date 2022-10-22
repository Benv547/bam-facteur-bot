const {signalement, modRole} = require("../config.json");
const signalementDB = require("../database/signalement");
const suggestionDB = require("../database/suggestion");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: 'warnHelp',
    async execute(interaction) {

        // Check if message is already in database
        if (await signalementDB.get_id_message(interaction.message.id) !== null) {
            return await interaction.reply({content: "Ce message a déjà été signalé.", ephemeral: true});
        }

        const content = interaction.fields.getTextInputValue('warnHelp');
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

        try {
            // Save signalement in database
            await signalementDB.insertSignalement(message.id, sender.id, receiverId, content, null);
        } catch (e) {
            console.log(e);
        }
    },
};