const {ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const helpDB = require("../database/help");
const userDB = require("../database/user");
const roles = require("../utils/roles");
const xpAction = require("../utils/xpAction");

module.exports = {
    name: 'replyHelp',
    async execute(interaction) {

        // Check if the user exists in the database
        const userId = await userDB.getUser(interaction.user.id);
        if (userId == null) {
            // Add the user to the database
            await userDB.createUser(interaction.user.id, 0, 0);
        }

        // Get content
        const content = interaction.fields.getTextInputValue('textHelp');
        if (content.trim() === '') {
            return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
        }

        // Create buttons to upvote and downvote and warn
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('replyHelp')
                    .setLabel('Répondre')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('warning_help')
                    .setLabel('⚠️')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Create embed
        let embed;
        if (await roles.userIsAdmin(interaction.member)) {
            embed = createEmbeds.createFullEmbed("Administrateur", content, null, null, 0xFF0000, null);
        } else if (await roles.userIsMod(interaction.member)) {
            embed = createEmbeds.createFullEmbed("Modérateur", content, null, null, 0xff8c00, null);
        } else {
            embed = createEmbeds.createFullEmbed("Un•e illustre inconnu•e", content, null, null, 0x2F3136, null);
        }

        // Get suggestion number
        const repliesNumber = parseInt(await helpDB.getTotalOfReplies()) + 1;

        // Fetch message
        let reply;
        const thread_id = await helpDB.get_id_thread(interaction.message.id);
        if (thread_id == null) {
            const message = await interaction.channel.messages.fetch(interaction.message.id);
            if (interaction.channel.isThread() && interaction.channel.archived) return await interaction.reply({ content: 'La demande d\'aide est archivée.', ephemeral: true });
            reply = await message.reply({ content: 'Réponse n°' + repliesNumber, embeds: [embed], components: [row] });
        } else {
            const thread = await interaction.guild.channels.fetch(thread_id);
            if (thread.locked) return await interaction.reply({ content: 'La demande d\'aide est verrouillée.', ephemeral: true });
            reply = await thread.send({ content: 'Réponse n°' + repliesNumber, embeds: [embed], components: [row] });
        }

        // Save message id in database
        await helpDB.insertHelp(reply.id, null, interaction.user.id, content, true);
        await interaction.reply({ content: 'Votre réponse a été envoyée.', ephemeral: true });

        await xpAction.increment(interaction.guild, interaction.member.id, 25);
    }
};