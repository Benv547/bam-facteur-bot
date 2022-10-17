const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const bottleDB = require("../database/bottle");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relancer')
        .setDescription('Relancer une bouteille archivée !')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Le nom de la bouteille')
                .setRequired(true)),
    async execute(interaction) {
        let bottle;
        const bottles = await bottleDB.getBottleForUserWithName(interaction.user.id, interaction.options.getString('name'));
        if (bottles.length === 0) {
            try {
                bottle = await bottleDB.getBottle(interaction.options.getString('name'));
            }
            catch (e) {
                return interaction.reply({content: 'Cette bouteille n\'existe pas.', ephemeral: true});
            }

            if (bottle === null) {
                return interaction.reply({content: 'Cette bouteille n\'existe pas.', ephemeral: true});
            }

            if (bottle.id_user_sender !== interaction.user.id && bottle.id_user_receiver !== interaction.user.id) {
                return interaction.reply({content: 'Cette bouteille n\'existe pas.', ephemeral: true});
            }
        } else if (bottles.length > 1) {
            return interaction.reply({content: 'Plusieurs bouteilles ont ce nom, veuillez préciser.',
            });
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
            .setCustomId('replyBottleArchived')
            .setTitle('Ma réponse');
        // Add components to modal
        const bottleInput = new TextInputBuilder()
            .setCustomId('idBottle')
            .setLabel("L'identifiant de la bouteille")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short)
            .setValue(bottle.id_bottle)
            .setRequired(true);
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textBottle')
            .setLabel("Quel est votre message ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);
        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(bottleInput);
        const secondaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        // Add inputs to the modal
        modal.addComponents(primaryActionRow, secondaryActionRow);
        // Show the modal to the user
        await interaction.showModal(modal);
    },
};