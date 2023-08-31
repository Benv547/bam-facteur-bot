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

        await messageReaction.users.remove(member.id);

        const content = "Message against the rules";

        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_abusif')
                    .setLabel('😡 Abusive')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_warn')
                    .setLabel('⚠️ Warn')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_mute')
                    .setLabel('🚫 Mute')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sanction_ban')
                    .setLabel('⛔️ Ban')
                    .setStyle(ButtonStyle.Danger),
            );


        if (await signalementDB.getSignalementIleMessageByMessage(messageReaction.message.id) !== null) {
            try {
                return await member.send({content: "This message has already been reported."});
            } catch {
            }
        }

        let receiver_id = "";
        let warningContent = "";

        const messageIle = await messageIleDB.getMessage(messageReaction.message.id);
        if (messageIle !== null) {
            receiver_id = messageIle.id_user;
            warningContent = messageIle.content;
        } else {
            if (messageReaction.message.author.bot) {
                return;
            }
            receiver_id = messageReaction.message.author.id;
            warningContent = messageReaction.message.content;
        }

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
        const nbWarnAbus = await sanctionDB.countDetail(receiver_id, "abusif");
        const nbWarn = await sanctionDB.countDetail(receiver_id, "warn");
        const nbMute = await sanctionDB.countDetail(receiver_id, "mute");
        const nbBan = await sanctionDB.countDetail(receiver_id, "ban");
        let resume = "😡 **" + nbWarnAbus + "**, ⚠️ **" + nbWarn + "**, 🚫 **" + nbMute + "**, ⛔️ **" + nbBan + "**";

        // Get guild channel by id
        const channel = messageReaction.message.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = messageReaction.message.guild.roles.cache.get(modRole);
        const embed = createEmbeds.createFullEmbed('New report', '**Message:** ' + warningContent + '\n**Reason: **' + content + '\n\n**Judicial record: **' + resume + "\n**Detail: ** \n" + text, null, null, 0x2f3136, null);
        // Send message
        const message = await channel.send({ content: mod.toString(), embeds: [embed], components: [row] });

        try {
            await member.send({ content: 'Your report has been sent.' });
        } catch {}

        // Save signalement to DB
        await signalementDB.insertSignalement(message.id, member.id, receiver_id, content, "message_ile");
        await signalementDB.insertSignalementIleMessage(message.id, messageReaction.message.id, messageReaction.message.channelId);

    }
};