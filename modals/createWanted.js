const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newWantedCategory, wantedChannel} = require("../config.json");
const wantedDB = require("../database/wanted");
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require("../database/sticker");

module.exports = {
    name: 'createWanted',
    async execute(interaction) {

        const content = interaction.fields.getTextInputValue('textWanted');

        let sender = await userDB.getUser(interaction.member.id);
        if (sender === null) {
            await userDB.createUser(interaction.member.id, 0, 0);
            sender = await userDB.getUser(interaction.member.id);
        }

        await interaction.reply({ content: 'Votre recherche a été envoyée.', ephemeral: true });

        const color = await stateAndColorDB.getRandomColor();
        const state = await stateAndColorDB.getRandomState();
        const emoji = await stateAndColorDB.getRandomEmoji();
        const channel_name = emoji + "│recherche-" + color + "-" + state;

        // TODO: create channel
        const everyoneRole = interaction.guild.roles.everyone;
        var channel = await interaction.guild.channels.create({
            name: channel_name,
            type: ChannelType.GuildText
        })

        // TODO: move channel to "nouvelles bouteilles"
        const category = (await interaction.guild.channels.fetch()).find(c => c.id == newWantedCategory);


        // While number of channels in category is more than 45
        while (category.children.cache.size > 45) {
            try {
                const channelToDelete = category.children.cache.first();
                try {
                    const wanted = await wantedDB.get_wanted(channelToDelete.id);
                    const globalWantedChannel = await interaction.guild.channels.fetch(wantedChannel);

                    const message = await globalWantedChannel.messages.fetch(wanted.id_message);
                    await message.delete();
                } catch {}
                // Set archive to true
                await wantedDB.setArchived(channelToDelete.id);
                // Delete channel
                await channelToDelete.delete();
            } catch (error) {
                console.error(error);
            }
        }
        await channel.setParent(category);


        const sticker = await stickerDB.getSticker(sender.id_sticker);
        let stickerUrl = null;
        if (sticker !== null) {
            stickerUrl = sticker.url;
        }


        const embed = createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(interaction.guild, content), sender.diceBearSeed, stickerUrl, sender.signature, sender.color);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyWanted')
                    .setLabel('📨 Répondre')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warning_wanted')
                    .setLabel('⚠️ Signaler')
                    .setStyle(ButtonStyle.Danger),
            );



        // Send to channel
        const messageInitial = await channel.send({ content: '', embeds: [embed] });

        // Send message to channel of interaction
        const message = await interaction.channel.send({ content: '', embeds: [embed], components: [row] });

        await wantedDB.insertWanted(channel.id, interaction.guildId, interaction.member.id, message.id, channel_name, content);
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