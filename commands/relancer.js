const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const bottleDB = require("../database/bottle");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('relancer')
        .setDescription('Relancez une bouteille archivée !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom de la bouteille')
                .setRequired(true)),
    async execute(interaction) {
        let bottle;
        const bottles = await bottleDB.getBottleForUserWithName(interaction.user.id, interaction.options.getString('nom'));
        if (bottles.length === 0) {
            return interaction.reply({content: 'Cette bouteille n\'existe pas.', ephemeral: true});
        } else if (bottles.length > 1) {
            return interaction.reply({content: 'Plusieurs bouteilles contiennent ce nom, veuillez préciser.', ephemeral: true});
        } else {
            bottle = bottles[0];
        }

        // Check if bottle is archived
        if (!bottle.archived) {
            return interaction.reply({content: 'Cette bouteille n\'est pas archivée.', ephemeral: true});
        }

        // Check if bottle is terminated
        if (bottle.terminated) {
            return interaction.reply({content: 'Cette bouteille est terminée.', ephemeral: true});
        }

        // Check if sender is user
        if (bottle.id_user_sender !== interaction.user.id) {
            return interaction.reply({content: 'Ce n\'est pas à vous de répondre.', ephemeral: true});
        }

        // Open modal
        const modal = new ModalBuilder()
            .setCustomId('replyBottleArchived_' + bottle.id_bottle)
            .setTitle('Ma réponse');
        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textBottle')
            .setLabel("Quel est votre message ?")
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