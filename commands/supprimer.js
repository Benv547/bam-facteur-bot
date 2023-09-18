const { SlashCommandBuilder, userMention } = require('discord.js');
const roles = require("../utils/roles");
const bottleDB = require("../database/bottle")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('supprimer')
        .setDescription('Delete a bottle from the database')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('The channel id')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsAdmin(interaction.member)) {
            if (await bottleDB.getBottleWithId(interaction.options.getString('channel_id'))) {
                try {
                    await bottleDB.deleteBottleWithChannel(interaction.options.getString('channel_id'));
                }
                catch {
                    return interaction.reply({ content: 'Une erreur est survenue', ephemeral: true });
                }

                try {
                    const channel = await interaction.guild.channels.fetch(interaction.options.getString('channel_id'));
                    channel.delete();
                }
                catch {
                    return interaction.reply({ content: 'La bouteille a bien été supprimée de la base de donnée, mais le salon avait déjà été supprimé', ephemeral: true });
                }

                return await interaction.reply({ content: 'La bouteille a bien été suprimée', ephemeral: true });

            }
            else {
                return await interaction.reply({ content: 'La bouteille n\'existe pas dans la base de donnée', ephemeral: true });
            }
        }
        return interaction.reply({ content: 'Vous n\'avez pas le droit de faire cela.', ephemeral: true });
    },
};


