const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const bottleDB = require("../database/bottle");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('relaunch')
        .setDescription('Relaunch an archived bottle!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the bottle')
                .setRequired(true)),
    async execute(interaction) {
        let bottle;
        const bottles = await bottleDB.getBottleForUserWithName(interaction.user.id, interaction.options.getString('name'));
        if (bottles.length === 0) {
            return interaction.reply({content: 'This bottle dosn\'t exist', ephemeral: true});
        } else if (bottles.length > 1) {
            return interaction.reply({content: 'Several bottles have this name, please specify.', ephemeral: true});
        } else {
            bottle = bottles[0];
        }

        // Check if bottle is archived
        if (!bottle.archived) {
            return interaction.reply({content: 'This bottle is not archived.', ephemeral: true});
        }

        // Check if bottle is terminated
        if (bottle.terminated) {
            return interaction.reply({content: 'This bottle is finished.', ephemeral: true});
        }

        // Check if sender is user
        if (bottle.id_user_sender !== interaction.user.id) {
            return interaction.reply({content: 'It\'s not up to you to answer.', ephemeral: true});
        }

        // Open modal
        const modal = new ModalBuilder()
            .setCustomId('replyBottleArchived_' + bottle.id_bottle)
            .setTitle('My reply');
        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textBottle')
            .setLabel("What's your message?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);
        // An action row only holds one text input,
        // so you need one action row per text input.
        const secondaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        // Add inputs to the modal
        modal.addComponents(secondaryActionRow);
        // Show the modal to the user
        await interaction.showModal(modal);
    },
};