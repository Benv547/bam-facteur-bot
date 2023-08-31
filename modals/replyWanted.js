const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {wantedChannel} = require("../config.json");
const wantedDB = require("../database/wanted");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require("../database/sticker");
const xpAction = require("../utils/xpAction");
const footerDB = require("../database/footer");

module.exports = {
    name: 'replyWanted',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textWanted');
        if (content.trim() === '') {
            return await interaction.reply({content: "The message cannot be empty.", ephemeral: true});
        }

        let sender = await userDB.getUser(interaction.member.id);
        if (sender === null) {
            await userDB.createUser(interaction.member.id, 0, 0);
            sender = await userDB.getUser(interaction.member.id);
        }


        const id_channel = await wantedDB.get_id_channel(interaction.message.id);
        if (id_channel === null) {

            const id_channel = interaction.channelId;
            const id_message = await wantedDB.get_id_message(interaction.channel.id);

            const channel = await interaction.guild.channels.fetch(wantedChannel);
            const message = await channel.messages.fetch(id_message);
            await message.delete();

            await interaction.update({ content: '', components: [] });

            const listMessageIds = await wantedDB.getAllReplies(id_channel);
            for (let i = 0; i < listMessageIds.length; i++) {
                if (listMessageIds[i].id_message !== interaction.message.id) {
                    const message = await interaction.channel.messages.fetch(listMessageIds[i].id_message);
                    await message.delete();
                }
            }

            const id_user = await wantedDB.get_id_user_response(interaction.message.id);

            await bottleDB.insertBottle(id_channel, interaction.guildId, interaction.member.id, id_user, interaction.channelId, interaction.channel.name, 0);

            const wanted = await wantedDB.get_wanted(id_channel);
            const response = await wantedDB.get_wanted_response(interaction.message.id);
            await wantedDB.setArchived(id_channel);

            // Insert initial message...
            await messageDB.insertMessage(wanted.id_message, id_channel, wanted.id_user, wanted.content);
            await messageDB.insertMessage(response.id_message, id_channel, response.id_user, response.content);

            await bottle.reply(interaction.guild, interaction.member.id, interaction.channel, content);

            await xpAction.increment(interaction.guild, interaction.member.id, 50);
        } else {

            const reply = await wantedDB.get_reply_for_user_and_channel(interaction.member.id, id_channel);
            if (reply !== null) {
                return await interaction.reply({ content: 'You have already answered this wanted notice.', ephemeral: true });
            }

            const id_user = await wantedDB.get_id_user(interaction.message.id);
            if (id_user === interaction.member.id) {
                return await interaction.reply({ content: 'You can\'t answer your own wanted notice.', ephemeral: true });
            }

            const channel = await interaction.guild.channels.fetch(id_channel);
            await interaction.reply({ content: 'Your reply has been sent.', ephemeral: true });

            const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(interaction.guild, content), sender.diceBearSeed, sender.id_sticker, sender.signature, sender.color, sender.id_footer);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('replyWanted')
                        .setLabel('📨 Reply')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('warning_wantedReply')
                        .setLabel('⚠️ Report')
                        .setStyle(ButtonStyle.Danger),
                );

            const member = await interaction.guild.members.fetch(id_user);

            // Send message to channel of interaction
            const message = await channel.send({ content: 'You have received a response ' + member.toString(), embeds: [embed], components: [row] });

            await wantedDB.insertWantedResponse(id_channel, interaction.guildId, interaction.member.id, message.id, content);

            await xpAction.increment(interaction.guild, interaction.member.id, 10);
        }
    },

    transformEmojiToDiscordEmoji: function (guild, text) {
        const emojis = text.match(/:[a-zA-Z0-9_]+:/g);
        if (emojis !== null) {
            for (const e of emojis) {
                text = text.replace(e, this.emojiToDiscordEmoji(guild, e));
            }
        }
        return text;
    },
    emojiToDiscordEmoji: function (guild, emoji) {
        const emojiName = emoji.replace(/:/g, '');
        const emojiFetched = guild.emojis.cache.find(emoji => emoji.name === emojiName);
        if (emojiFetched !== undefined) {
            return emojiFetched.toString();
        }
        return emoji;
    }
};