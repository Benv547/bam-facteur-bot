const { SlashCommandBuilder } = require('discord.js');
const createEmbeds = require("../utils/createEmbeds");
const stickerDB = require('../database/sticker');
const roles = require("../utils/roles");
const userDB = require("../database/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givesticker')
        .setDescription('Give a sticker.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user id')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('stickername')
                .setDescription('The sticker name to give')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            // Get the user
            const userId = interaction.options.getString('userid');
            const stickername = interaction.options.getString('stickername');
            // Set the user's currency
            const sticker = await stickerDB.getStickerWithName(stickername);
            if (sticker == null || sticker == undefined || sticker.length == 0) {
                return interaction.reply({ content:'This sticker does not exist.', ephemeral: true});
            } else if (sticker.length > 1) {
                return interaction.reply({ content:'Several stickers have the same name, refine your search.', ephemeral: true});
            }

            const checkUserID = await userDB.getUser(userId);
            if (checkUserID == null) {
                // Add the user to the database
                await userDB.createUser(userId, 0, 0);
            }

            await stickerDB.giveStickerToUser(userId, sticker[0].id_sticker, interaction.guild.id);

            // Fetch user
            const user = await interaction.guild.members.fetch(userId);
            const embed = createEmbeds.createFullEmbed('What luck!', 'You\'ve received the sticker **' + sticker[0].name + '**!', null, null, 0x2f3136, null);

            // Send direct message to user
            try {
                await user.send({content: "", embeds: [embed]});
            } catch {
            }
            return await interaction.reply({ content:'C\'est fait.', ephemeral: true});
        }
        return interaction.reply({ content:'Vous n\'avez pas le droit de faire cela.', ephemeral: true});
    },
};