const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const message_ileDB = require("../database/message_ile");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");
const user_ileDB = require("../database/user_ile");
const profile_ileDB = require("../database/profile_ile");

module.exports = {
    name: 'createIleMessage',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        const price = 10;
        if(!await orAction.reduce(interaction.user.id, price)) {
            const embed = createEmbeds.createFullEmbed('Il manque quelque chose..', 'Vous n\'avez pas assez d\'argent pour envoyer un message ! Economisez **' + price + ' pièces d\'or** et revenez me voir !', null, null, null, null);
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }

        // Get content
        let content = interaction.fields.getTextInputValue('textMessage');
        content = this.transformEmojiToDiscordEmoji(interaction.guild, content);

        // Create buttons to upvote and downvote and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyIleMessage')
                    .setLabel('📩️')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('createIleMessage')
                    .setLabel('✉️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('warning_ileMessage')
                    .setLabel('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Create embed
        const embed = createEmbeds.createFullEmbed("", content, null, null, 0x2F3136, null, false);

        // Fetch user
        const user_profileId = await user_ileDB.get_id_profile(interaction.user.id);
        let profile = null;
        let finded = false;
        if (user_profileId == null) {
            let randomProfileId = await profile_ileDB.getRandomProfileId();
            // Add the user to the database
            await user_ileDB.createUser(interaction.user.id, interaction.channel.id, randomProfileId);
            profile = await profile_ileDB.getProfile(randomProfileId);
        } else {
            finded = true;
            profile = await profile_ileDB.getProfile(user_profileId);
        }
        const randNumber = await user_ileDB.getRandNumber(interaction.user.id);

        // Add author to embed
        embed.setAuthor({ name: profile.signature + ' anonyme#' + randNumber, iconURL: profile.image_url});

        // Send embed
        const message = await interaction.channel.send({ content: '** **', embeds: [embed], components: [row] });

        // Save message id in database
        await message_ileDB.insertMessage(message.id, userId.id_user, interaction.channel.id, interaction.guild.id, content);

        if (finded) {
            // Don't change interaction message
            await interaction.update({
                content: interaction.message.content,
                embeds: interaction.message.embeds,
                components: interaction.message.components
            });
        } else {
            await interaction.reply({ content: "Bienvenue sur l'île en tant que **" + profile.signature + ' anonyme#' + randNumber + "** ! Vous pouvez maintenant envoyer des messages sur l'île !\n⚠️ **Attention**, chaque message te coûtera **10 pièces d'or**.", ephemeral: true });
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