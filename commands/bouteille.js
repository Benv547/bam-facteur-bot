const { SlashCommandBuilder } = require('discord.js');
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('bouteille')
        .setDescription('Regardez vos bouteilles !')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Le nom de la bouteille')),
    async execute(interaction) {
        if (interaction.options.getString('name') === null) {
            const bottles = await bottleDB.getBottleForUser(interaction.user.id);
            let message = '';
            if (bottles.length === 0) {
                message = 'Vous n\'avez pas de bouteille !';
            } else {
                bottles.forEach(bottle => {
                    message += '• **' + bottle.name + '** (' + bottle.id_bottle + ')\n';
                    let status = '';
                    if (bottle.terminated) {
                        status = '💀 terminée';
                    } else if (bottle.archived) {
                        status = '🗄️archivée';
                    } else if (bottle.id_user_sender === interaction.user.id) {
                        status = '📤 en attente de réponse de votre part';
                    } else {
                        status = '📥 en attente de réponse de votre correspondant';
                    }
                    message += 'Statut : ' + status + '\n\n';
                });
            }
            const embed = createEmbeds.createFullEmbed("Vos bouteilles", message, null, null, 0x2f3136, null);
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        } else {
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
                return interaction.reply({content: 'Plusieurs bouteilles ont ce nom, veuillez préciser.', ephemeral: true});
            } else {
                bottle = bottles[0];
            }

            let message = '';

            const messages = await messageDB.getMessagesOfBottle(bottle.id_bottle);
            messages.forEach(messageDB => {
                if (messageDB.id_user === interaction.user.id) {
                    message += '📤 **Vous :** ' + messageDB.content + '\n';
                } else {
                    message += '📥 **Votre correspondant :** ' + messageDB.content + '\n';
                }
            });

            // if the message.length is too long
            if (message.length > 2000) {
                // cut the message
                message = message.substring(0, 1950);
                // add a ... at the end
                message += '... (message trop long)\n';
            }

            let status = '';
            if (bottle.terminated) {
                status = '💀 terminée';
            } else if (bottle.archived) {
                status = '🗄️archivée';
            } else if (bottle.id_user_sender === interaction.user.id) {
                status = '📨 en attente de réponse de votre part';
            } else {
                status = '📥 en attente de réponse de votre correspondant';
            }
            message += '\nStatut : ' + status + '\n';
            const embed = createEmbeds.createFullEmbed(bottle.name, message, null, null, 0x2f3136, null);
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        }
    },
};