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

        const type = interaction.customId.split('_')[1];

        const content = interaction.fields.getTextInputValue('textWanted');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        let sender = await userDB.getUser(interaction.member.id);
        if (sender === null) {
            await userDB.createUser(interaction.member.id, 0, 0);
            sender = await userDB.getUser(interaction.member.id);
        }

        const id_channel = await wantedDB.get_id_channel(interaction.message.id);
        if (id_channel === null) {
            return await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
        } else {

            const reply = await wantedDB.get_reply_for_user_and_channel(interaction.member.id, id_channel);
            if (reply !== null) {
                return await interaction.reply({ content: 'Vous avez déjà répondu à cette recherche.', ephemeral: true });
            }

            const id_user = await wantedDB.get_id_user(interaction.message.id);
            if (id_user === interaction.member.id) {
                return await interaction.reply({ content: 'Vous ne pouvez pas répondre à votre propre recherche.', ephemeral: true });
            }

            const channel = await interaction.guild.channels.fetch(id_channel);
            await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });
            // random dicebear seed
            const diceBearSeed = Math.floor(Math.random() * 1000000000);
            const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(interaction.guild, content), diceBearSeed, null,  "Un•e illustre inconnu•e", '945b44', null);

            const row = new ActionRowBuilder();
            if (type !== 'anonymous') {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('replyWanted_join')
                        .setLabel('Inviter')
                        .setEmoji('📨')
                        .setStyle(ButtonStyle.Primary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('warning_wantedReply')
                        .setLabel('Signaler')
                        .setEmoji('⚠️')
                        .setStyle(ButtonStyle.Danger),
                );

            const member = await interaction.guild.members.fetch(id_user);

            // Send message to channel of interaction
            const message = await channel.send({ content: 'Vous avez reçu une réponse ' + member.toString(), embeds: [embed], components: [row] });

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