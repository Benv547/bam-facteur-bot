const { signalement, modRole } = require("../config.json");
const messageDB = require("../database/message");
const bottleDB = require("../database/bottle");
const wantedDB = require("../database/wanted");
const signalementDB = require("../database/signalement");
const messageIleDB = require("../database/message_ile");
const ticketDB = require("../database/ticket");
const birdDB = require("../database/bird");
const suggestionDB = require("../database/suggestion");
const helpDB = require("../database/help");
const sanctionDB = require("../database/sanctions");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    name: 'warning',
    async execute(interaction) {

        const warningType = interaction.customId.split('_')[1];

        const content = interaction.fields.getTextInputValue('textWarning');
        const sender = interaction.member;

        let receiver_id;

        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_abusif')
                    .setLabel('Abusif')
                    .setEmoji('😡')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_warn')
                    .setLabel('Avertir')
                    .setEmoji('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_mute')
                    .setLabel('Exclure')
                    .setEmoji('🚫')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_ban')
                    .setLabel('Bannir')
                    .setEmoji('💢')
                    .setStyle(ButtonStyle.Danger),
            );





        let warningContent;
        let toDeleteChannelId;
        if (warningType === 'bottle') {
            // Check if message is already in database
            if (await signalementDB.getSignalementBottleByChannel(interaction.channelId) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            warningContent = await messageDB.getContentOfMessage(interaction.message.id);
            const bottle = await bottleDB.getBottle(interaction.channel.id);
            receiver_id = bottle.id_user_receiver;
            row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('historyWarning')
                        .setLabel('Historique')
                        .setEmoji('📜')
                        .setStyle(ButtonStyle.Secondary),
                );

            // Fetch last message
            const lastMessageId = await messageDB.getLastMessageId(interaction.channel.id);
            const lastMessage = await interaction.channel.messages.fetch(lastMessageId);
            // Remove actions from last message
            await lastMessage.edit({ content: "", embeds: lastMessage.embeds, components: lastMessage.components });
        } else if (warningType === 'wanted') {
            if (await signalementDB.getSignalementWantedByMessage(interaction.message.id) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            const wanted = await wantedDB.get_wanted_by_id(interaction.message.id);
            receiver_id = wanted.id_user;
            warningContent = wanted.content;
            toDeleteChannelId = wanted.id_channel;
        } else if (warningType === 'wantedReply') {
            if (await signalementDB.getSignalementWantedByMessage(interaction.message.id) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            const wanted = await wantedDB.get_wanted_response(interaction.message.id);
            receiver_id = wanted.id_user;
            warningContent = wanted.content;
            toDeleteChannelId = interaction.channelId;
        } else if (warningType === 'ticket') {
            if (await signalementDB.getSignalementTicketByChannel(interaction.channelId) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            receiver_id = await ticketDB.get_id_user(interaction.channel.id);
            warningContent = "...";
        } else if (warningType === 'suggestion') {
            if (await signalementDB.getSignalementSuggestionByMessage(interaction.message.id) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            const suggestion = await suggestionDB.getSuggestion(interaction.message.id);
            receiver_id = suggestion.id_user;
            warningContent = suggestion.content;
        } else if (warningType === 'help') {
            if (await signalementDB.getSignalementHelpByMessage(interaction.message.id) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            const help = await helpDB.getHelp(interaction.message.id);
            receiver_id = help.id_user;
            warningContent = help.content;
        } else if (warningType === 'bird') {
            if (await signalementDB.getSignalementBirdByChannel(interaction.channelId) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            const bird = await birdDB.getBird(interaction.message.id);
            receiver_id = bird.id_user;
            warningContent = bird.content;
        } else if (warningType === 'ileMessage') {
            if (await signalementDB.getSignalementIleMessageByMessage(interaction.message.id) !== null) {
                return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
            }
            const messageIle = await messageIleDB.getMessage(interaction.message.id);
            receiver_id = messageIle.id_user;
            warningContent = messageIle.content;
        }

        if (warningType !== 'bottle') {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteSanction')
                    .setLabel('(Signalement buggé)')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger),
            )
        }

        if (warningContent.length > 1500) {
            warningContent = warningContent.substring(0, 1500) + "...";
        }


        const warnDetail = await sanctionDB.getOldWarn(receiver_id);
        let text = "";
        for (let i = 0; i < warnDetail.length; i++) {
            switch (warnDetail[i].gravity) {
                case "abusif":
                    text += "😡 ";
                    break;
                case "warn":
                    text += "⚠️ ";
                    break;
                case "mute":
                    text += "🚫 ";
                    break;
                case "ban":
                    text += "💢 ";
                    break;
                default :
                    break;
            }
            text += warnDetail[i].content + "\n";
        }

        const warnSenderDetail = await sanctionDB.getOldWarn(sender.id);
        let textAcusateur = "";
        for (let i = 0; i < warnSenderDetail.length; i++) {
            switch (warnSenderDetail[i].gravity) {
                case "abusif":
                    textAcusateur += "😡 " + warnSenderDetail[i].content + "\n";
                    break;
                default :
                    break;
            }
        }
        const nbWarnAbusSender = await sanctionDB.countDetail(sender.id, "abusif");
        const nbWarnAbus = await sanctionDB.countDetail(receiver_id, "abusif");
        const nbWarn = await sanctionDB.countDetail(receiver_id, "warn");
        const nbMute = await sanctionDB.countDetail(receiver_id, "mute");
        const nbBan = await sanctionDB.countDetail(receiver_id, "ban");
        let resume = "😡 **" + nbWarnAbus + "**, ⚠️ **" + nbWarn + "**, 🚫 **" + nbMute + "**, 💢 **" + nbBan + "**";

        // Get guild channel by id
        const channel = interaction.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = interaction.guild.roles.cache.get(modRole);
        const embed = createEmbeds.createFullEmbed('Signalement dans ' + interaction.channel.name, '**Message :** ' + warningContent + '\n\n**Raison : **' + content + '\n\n**L\'accusé a : **' + resume + '\n**Détail de l\'accusé :** \n' + text +'\n**L\'accusateur a : ' + nbWarnAbusSender +'** warn abusifs\n**Détail de l\'accusateur :**\n' + textAcusateur, null, null, 0x2f3136, null);
        // Send message
        const message = await channel.send({ content: mod.toString(), embeds: [embed], components: [row] });


        await interaction.reply({ content: 'Votre signalement a été envoyé.', ephemeral: true });


        // Save signalement to DB
        await signalementDB.insertSignalement(message.id, sender.id, receiver_id, content, warningType);
        if (warningType === 'bottle') {
            await signalementDB.insertSignalementBottle(message.id, interaction.channelId);
        } else if (warningType === 'wanted' || warningType === 'wantedReply') {
            await signalementDB.insertSignalementWanted(message.id, interaction.message.id, toDeleteChannelId);
        } else if (warningType === 'ticket') {
            await signalementDB.insertSignalementTicket(message.id, interaction.channelId);
        } else if (warningType === 'suggestion') {
            await signalementDB.insertSignalementSuggestion(message.id, interaction.message.id, interaction.channelId);
        } else if (warningType === 'help') {
            await signalementDB.insertSignalementHelp(message.id, interaction.message.id, interaction.channelId);
        } else if (warningType === 'bird') {
            await signalementDB.insertSignalementBird(message.id, interaction.message.id);
        } else if (warningType === 'ileMessage') {
            await signalementDB.insertSignalementIleMessage(message.id, interaction.message.id, interaction.channelId);
        }
    },
};