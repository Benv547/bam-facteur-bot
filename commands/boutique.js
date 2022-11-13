const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const roles = require("../utils/roles");
const path = require("path");
const fs = require("fs");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('boutique')
        .setDescription('Voir la liste des commandes payantes du bot !'),
    async execute(interaction) {
        // Read commands folder
        const { EmbedBuilder } = require('discord.js');
        const fs = require('fs');
        const path = require('path');
        // if a command is given, show details about it

        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setDescription('Nous n\'avons **pas encore de boutique**, mais voici la liste des commandes payantes du bot !')
            .setTitle('Liste des commandes payantes');
        // Add fields
        for (const file of commandFiles) {
            const filePath = path.join(__dirname, file);
            const command = require(filePath);
            if (command.public && command.price) {
                let name = '/' + command.data.name + ' ';
                // Get options
                let options = command.data.options;
                if (options !== undefined) {
                    for (const option of options) {
                        // if is required
                        if (option.required) {
                            name +=  '[' + option.name + '] ';
                        } else {
                            name +=  '<' + option.name + '> ';
                        }
                    }
                }
                let price = "";
                let priceValue;
                if (command.price) {
                    priceValue = command.price;
                    if (await roles.userIsBooster(interaction.member)) {
                        priceValue = Math.round(priceValue * 0.5);
                    } else if (await roles.userIsVip(interaction.member)) {
                        priceValue = Math.round(priceValue * 0.8);
                    }
                    price = '\n*Cette commande coûte **' + priceValue + ' pièces d\'or**.*';
                }
                embed.addFields({ name: name, value: command.data.description + price + '\n** **', inline: false });
            }
        }
        embed.setFooter({ text: 'Pour plus d\'informations sur une commande, tapez /aide [nom de la commande]' });
        // Send embed
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};