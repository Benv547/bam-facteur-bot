const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const roles = require("../utils/roles");
const path = require("path");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('aide')
        .setDescription('Voir la liste des commandes publiques du bot !')
        .addStringOption(option =>
            option.setName('commande')
                .setDescription('Le nom de la commande')),
    async execute(interaction) {
        // Read commands folder
        const { EmbedBuilder } = require('discord.js');
        const fs = require('fs');
        const path = require('path');
        // if a command is given, show details about it
        if (interaction.options.getString('commande') !== null) {
            const command = interaction.options.getString('commande').toLowerCase();
            try {
                const commandFile = require(path.resolve(__dirname, command + '.js'));

                let price = "";
                let priceValue;
                if (commandFile.price) {
                    priceValue = commandFile.price;
                    if (await roles.userIsBooster(interaction.member)) {
                        priceValue = Math.round(priceValue * 0.5);
                    } else if (await roles.userIsVip(interaction.member)) {
                        priceValue = Math.round(priceValue * 0.8);
                    }
                    price = '\n\n*Cette commande coûte **' + priceValue + ' <:piece:1045638309235404860>**.*';
                }

                const embed = new EmbedBuilder()
                    .setTitle('Commande **/' + command + '**')
                    .setDescription(commandFile.data.description + price);
                // get the options of the command
                if (commandFile.data.options !== undefined) {
                    let options = commandFile.data.options;
                    for (const option of options) {
                        // if is required
                        let name = option.required ? '[' + option.name + '] (obligatoire)' : '<' + option.name + '>  (facultatif)';
                        embed.addFields({name: name, value: option.description});
                    }
                }
                return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
            } catch (error) {
                return interaction.reply({ content: "Cette commande n'existe pas !", ephemeral: true });
            }
        }
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setTitle('Liste des commandes publiques');
        // Add fields
        for (const file of commandFiles) {
            const filePath = path.join(__dirname, file);
            const command = require(filePath);
            if (command.public) {
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
                    price = '\n*Cette commande coûte **' + priceValue + ' <:piece:1045638309235404860>**.*';
                }
                embed.addFields({ name: name, value: command.data.description + price + '\n** **', inline: false });
            }
        }
        embed.setFooter({ text: 'Pour plus d\'informations sur une commande, tapez /aide [nom de la commande]' });
        // Send embed
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};