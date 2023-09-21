const { SlashCommandBuilder} = require('discord.js');
const roles = require("../utils/roles");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Used to delete messages')
        .addStringOption(option =>
            option.setName('number')
                .setDescription('Number of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        if (await roles.userIsMod(interaction.member)) {
            let nombre_message = interaction.options.getString('number');
            if(nombre_message>80){
                nombre_message=80;
            }
            const messages = await interaction.channel.messages.fetch({limit: nombre_message});
            messages.forEach(function (message) {  
                message.delete();
            });
            return interaction.reply({ content: nombre_message + ' messages are currently being deleted', ephemeral: true })
        }
        return interaction.reply({ content: 'You can\'t do it.', ephemeral: true });
    },
};


