const { signalement, modRole } = require("../config.json");
const messageDB = require("../database/message");
const bottleDB = require("../database/bottle");
const signalementDB = require("../database/signalement");
const sanctionDB = require("../database/sanctions");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'warningBottle',
    async execute(interaction) {

        // Check if message is already in database
        if (await signalementDB.get_id_message(interaction.channel.id) !== null) {
            return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
        }

        const content = interaction.fields.getTextInputValue('textWarning');
        const sender = interaction.member;
        
        // Get receiver from DB
        const receiver_id = await bottleDB.getReceiver(interaction.channel.id);

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
                    .setLabel('✉ Historique')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Get content from database
        const warningContent = await messageDB.getContentOfMessage(interaction.message.id);
        const warnDetail = await sanctionDB.getOldWarn(receiver_id);
        let text = " ";
        for (let i = 0; i < warnDetail.length; i++) {
            switch (warnDetail[i].gravity) {
                case "Warn abusif":
                    text += "😡 ";
                    break;
                case "Warn":
                    text += "⚠️ ";
                    break;
                case "Mute":
                    text += "🚫 ";
                    break;
                case "Ban":
                    text += "⛔️ ";
                    break;
            }
            text += warnDetail[i].content + "\n\n";
        }
        const nbWarnAbus = await sanctionDB.countDetail(receiver_id, "Warn abusif");
        const nbWarn = await sanctionDB.countDetail(receiver_id, "Warn");
        const nbMute = await sanctionDB.countDetail(receiver_id, "Mute");
        const nbBan = await sanctionDB.countDetail(receiver_id, "Ban");
        let resume = "😡 **" + nbWarnAbus + "**, ⚠️ **" + nbWarn + "**, 🚫 **" + nbMute + "**, ⛔️ **" + nbBan + "**";

        // Get guild channel by id
        const channel = interaction.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = interaction.guild.roles.cache.get(modRole);
        const embed = createEmbeds.createFullEmbed('Nouveau signalement', '**Message :** ' + warningContent + '\n**Raison : **' + content + '\n\n**Résumé : **' + resume + "\n**Détail :** \n" + text, null, null, 0x2f3136, null);
        // Send message
        const message = await channel.send({ content: mod.toString(), embeds: [embed], components: [row] });


        // Fetch last message
        const lastMessageId = await messageDB.getLastMessageId(interaction.channel.id);
        const lastMessage = await interaction.channel.messages.fetch(lastMessageId);
        // Remove actions from last message
        await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: [] });


        // Save signalement to DB
        await signalementDB.insertSignalement(message.id, sender.id, receiver_id, content, interaction.channel.id);
    },
};