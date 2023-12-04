const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const signalementDB = require("../database/signalement");
const messageIleDB = require("../database/message_ile");
const sanctionDB = require("../database/sanctions");
const {signalement, modRole, ile} = require("../config.json");
const createEmbeds = require("../utils/createEmbeds");
const {newBirdChannel} = require("../config.json");
const roles = require("../utils/roles");
const userDB = require("../database/user");
const xpAction = require("../utils/xpAction");
const birdDB = require("../database/bird");

module.exports = {
    name: 'messageReactionAdd',
    async execute(messageReaction, member) {

        if (messageReaction.message.channelId === newBirdChannel) {
            await messageReaction.users.remove(member.id);

            const guild_member = await messageReaction.message.guild.members.fetch(member.id);
            if (!await roles.userIsBooster(guild_member) && !await roles.userIsVip(guild_member)) {
                return await interaction.reply({ content: 'Vous devez être VIP ou Booster pour pouvoir réagir à ce message avec un émoji personnalisé.', ephemeral: true });
            }

            if (await userDB.getUser(member.id) === null) {
                await userDB.createUser(member.id, 0, 0);
            }

            const bird = await birdDB.getBird(messageReaction.message.id);
            if (bird == null) {
                return await interaction.reply({ content: 'Ce message n\'est plus disponible.', ephemeral: true });
            }
            const old = await birdDB.getReactionByUser(bird.id_bird, member.id);
            if (old) {
                return await interaction.reply({ content: 'Vous avez déjà réagi à ce message.', ephemeral: true });
            }
            if (bird.id_user === member.id) {
                return await interaction.reply({ content: 'Vous ne pouvez pas réagir à votre propre message.', ephemeral: true });
            }

            // update message embed footer
            let newContent = '1 réaction(s)';
            try {
                let reactionCount = parseInt(messageReaction.message.content.split(' ')[0]);
                if (isNaN(reactionCount)) reactionCount = 0;
                const newReactionCount = reactionCount + 1;
                newContent = newReactionCount + ' réaction(s)';
            } catch {}
            await messageReaction.message.edit({ content: newContent, embeds: messageReaction.message.embeds });
            
            await birdDB.insertBirdReaction(bird.id_bird, guild_member.id, messageReaction.emoji.toString());
            await xpAction.increment(messageReaction.message.guild, guild_member.id, 15);
            return await interaction.reply({ content: 'Votre réaction a été prise en compte.', ephemeral: true });
        }

        if (messageReaction.emoji.toString() !== '⚠️') {
            return;
        }

        await messageReaction.users.remove(member.id);

        const content = "Message contraire au règlement";

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


        if (await signalementDB.getSignalementIleMessageByMessage(messageReaction.message.id) !== null) {
            try {
                return await interaction.reply({ content: 'Ce message a déjà été signalé.', ephemeral: true });
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
                    text += "💢 ";
                    break;
            }
            text += warnDetail[i].content + "\n\n";
        }
        const nbWarnAbus = await sanctionDB.countDetail(receiver_id, "abusif");
        const nbWarn = await sanctionDB.countDetail(receiver_id, "warn");
        const nbMute = await sanctionDB.countDetail(receiver_id, "mute");
        const nbBan = await sanctionDB.countDetail(receiver_id, "ban");
        let resume = "😡 **" + nbWarnAbus + "**, ⚠️ **" + nbWarn + "**, 🚫 **" + nbMute + "**, 💢 **" + nbBan + "**";

        // Get guild channel by id
        const channel = messageReaction.message.guild.channels.cache.get(signalement);
        // Get mod role by id
        const mod = messageReaction.message.guild.roles.cache.get(modRole);
        const embed = createEmbeds.createFullEmbed('Nouveau signalement', '**Message :** ' + warningContent + '\n**Raison : **' + content + '\n\n**Casier judiciaire : **' + resume + "\n**Détail :** \n" + text, null, null, 0x2f3136, null);
        // Send message
        const message = await channel.send({ content: mod.toString(), embeds: [embed], components: [row] });

        try {
            await interaction.reply({ content: 'Votre signalement a été envoyé.', ephemeral: true });
        } catch {}

        // Save signalement to DB
        await signalementDB.insertSignalement(message.id, member.id, receiver_id, content, "message_ile");
        await signalementDB.insertSignalementIleMessage(message.id, messageReaction.message.id, messageReaction.message.channelId);

    }
};