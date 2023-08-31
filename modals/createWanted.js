const bottle = require("../utils/bottleAction");
const userDB = require("../database/user");
const stateAndColorDB = require("../database/statesAndColors");
const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {newWantedCategory, wantedChannel} = require("../config.json");
const wantedDB = require("../database/wanted");
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require("../database/sticker");
const footerDB = require("../database/footer");

module.exports = {
    name: 'createWanted',
    async execute(interaction) {

        if (global.semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'You already have a wanted notice being created!', ephemeral: true });
        }

        try {
        const content = interaction.fields.getTextInputValue('textWanted');
        if (!content.toLowerCase().includes('I am looking for' || 'I\'m looking for')) {
            return await interaction.reply({ content: 'The message must contain "I am looking for"!\nYour message: ' + content, ephemeral: true });
        }

        if (content.trim() === '') {
            return await interaction.reply({content: "The message cannot be empty.", ephemeral: true});
        }

        global.semaphore.push(interaction.user.id);

        let sender = await userDB.getUser(interaction.member.id);
        if (sender === null) {
            await userDB.createUser(interaction.member.id, 0, 0);
            sender = await userDB.getUser(interaction.member.id);
        }

        await interaction.reply({ content: 'Your wanted notice has been sent.', ephemeral: true });

        const color = await stateAndColorDB.getRandomColor();
        const state = await stateAndColorDB.getRandomState();
        const emoji = await stateAndColorDB.getRandomEmoji();
        const channel_name = emoji + "│wanted-notice-" + color + "-" + state;

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

                    const sender = await interaction.guild.members.fetch(wanted.id_user);
                    const embed = createEmbeds.createFullEmbed("Gosh...", "Your wanted notice was removed because there were too many wanted notices in the category and you did not select an letter answer (or did not receive one).", null, null, null, null);
                    await sender.send({ content: '', embeds: [embed] });
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

        await channel.permissionOverwrites.create(interaction.member.id, {ViewChannel: true, SendMessages: false});

        const embed = await createEmbeds.createBottle(this.transformEmojiToDiscordEmoji(interaction.guild, content), sender.diceBearSeed, sender.id_sticker, "An illustrious stranger", sender.color, sender.id_footer);

        // ... with actions (reply, signal, resend to ocean)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyWanted')
                    .setLabel('📨 Reply')
                    .setStyle(ButtonStyle.Primary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('warning_wanted')
                    .setLabel('⚠️ Report')
                    .setStyle(ButtonStyle.Danger),
            );



        // Send to channel
        const messageInitial = await channel.send({ content: '', embeds: [embed] });

        // Send message to channel of interaction
        const message = await interaction.channel.send({ content: '', embeds: [embed], components: [row] });

        await wantedDB.insertWanted(channel.id, interaction.guildId, interaction.member.id, message.id, channel_name, content);

        await userDB.set_date_wanted(interaction.member.id, new Date());
    } finally {
        global.semaphore = global.semaphore.filter(item => item !== interaction.user.id);
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