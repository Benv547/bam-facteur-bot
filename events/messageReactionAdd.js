const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const signalementDB = require("../database/signalement");
const messageIleDB = require("../database/message_ile");
const sanctionDB = require("../database/sanctions");
const {signalement, modRole, ile} = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
module.exports = {
    name: 'messageReactionAdd',
    async execute(messageReaction, member) {

        if (messageReaction.emoji.toString() !== '⚠️') {
            return;
        }
        if (messageReaction.message.channel.id !== ile) {
            return;
        }

        await messageReaction.users.remove(member.id);

        const content = "Message contraire au règlement";

        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_abusif')
                    .setLabel('😡 Abusif')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_warn')
                    .setLabel('⚠️ Avertir')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_mute')
                    .setLabel('🚫 Exclure')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_ban')
                    .setLabel('⛔️ Bannir')
                    .setStyle(ButtonStyle.Danger),
            );


        if (await signalementDB.getSignalementIleMessageByMessage(messageReaction.message.id) !== null) {
            try {
                return await member.send({content: "Ce message a déjà été signalé."});
            } catch {
            }
        }

        const messageIle = await messageIleDB.getMessage(messageReaction.message.id);

        if (messageIle === null) {
            return;
        }

        const receiver_id = messageIle.id_user;
        const warningContent = messageIle.content;

        const warnDetail = await sanctionDB.getOldWarn(receiver_id);
        let text = " ";
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
        const channel = messageReaction.message.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = messageReaction.message.guild.roles.cache.get(modRole);
        const embed = createEmbeds.createFullEmbed('Nouveau signalement', '**Message :** ' + warningContent + '\n**Raison : **' + content + '\n\n**Casier judiciaire : **' + resume + "\n**Détail :** \n" + text, null, null, 0x2f3136, null);
        // Send message
        const message = await channel.send({ content: mod.toString(), embeds: [embed], components: [row] });

        try {
            await member.send({ content: 'Votre signalement a été envoyé.' });
        } catch {}

        // Save signalement to DB
        await signalementDB.insertSignalement(message.id, member.id, receiver_id, content, "ileMessage");
        await signalementDB.insertSignalementIleMessage(message.id, messageReaction.message.id, messageReaction.message.channelId);

    }
};