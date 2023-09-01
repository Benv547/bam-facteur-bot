const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const userDB = require("../database/user");
const orAction = require("../utils/orAction");
const createEmbeds = require("../utils/createEmbeds");
const user_ileDB = require("../database/user_ile");
const profile_ileDB = require("../database/profile_ile");
const message_ileDB = require("../database/message_ile");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('ano')
        .setDescription('Send an anonymous message on the island!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send anonymously')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get content
        let content = interaction.options.getString('message');

        if (content.trim() === '') {
            return await interaction.reply({content: "The message cannot be empty.", ephemeral: true});
        }

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

        if (!finded) {
            await interaction.reply({ content: "Welcome to the island as **" + profile.signature + ' anonymous#' + randNumber + "**! You can now send anonymous messages on the island!", ephemeral: true });
        } else {
            await interaction.reply({ content: "Your message has been successfully sent!", ephemeral: true });
        }

        // content = content.replace(/<@&/g, '$%@&#$');
        // content = content.replace(/<@/g, '$%@&#$');
        content = content.replace('@everyone', '$%@&#$');
        content = content.replace('@here', '$%@&#$');

        // Create buttons to upvote and downvote and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('createIleMessage')
                    .setLabel('✉️ Send a message')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Fetch webhook from channel by name
        const name = "IslandMessage";
        const webhooks = await interaction.channel.fetchWebhooks();
        let webhook = webhooks.find(webhook => webhook.name === name);

        // If the webhook doesn't exist, create it
        if (!webhook) {
            webhook = await interaction.channel.createWebhook(name);
        }

        // Send message
        const message = await webhook.send({ content: content, username: profile.signature + ' anonymous#' + randNumber, avatarURL: profile.image_url, components: [row] });

        // partern = 'https:\/\/discord\.com\/channels\/([0-9]*)\/([0-9]*)\/([0-9]*)'

        // Save message id in database
        await message_ileDB.insertMessage(message.id, userId.id_user, interaction.channel.id, interaction.guild.id, content);
    }
};