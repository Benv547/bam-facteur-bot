const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('bouteille')
        .setDescription('Regardez vos bouteilles !')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom de la bouteille')),
    async execute(interaction) {
        if (interaction.options.getString('nom') === null) {
            const bottles = await bottleDB.getBottleForUserWithOffsetAndLimit(interaction.user.id, 0, 10);
            let message = '';
            if (bottles.length === 0) {
                message = 'Vous n\'avez pas de bouteille !';
            } else {
                message += '📥 du côté de votre interlocuteur';
                message += '\n';
                message += '📨 de votre côté';
                message += '\n';
                message += '💀 bouteille terminée';
                message += '\n';
                message += '🗄️ bouteille archivée';
                message += '\n\n'

                bottles.forEach(bottle => {
                    message += '• **' + bottle.name + '** [';
                    let status = '';
                    if (bottle.archived) {
                        status = '🗄';
                    }
                    if (bottle.id_user_sender === interaction.user.id) {
                        status += '📨';
                    } else {
                        status += '📥';
                    }
                    if (bottle.terminated) {
                        status = '💀';
                    }
                    message += status + ']\n';
                });
            }
            const embed = createEmbeds.createFullEmbed("Vos bouteilles", message, null, null, 0x2f3136, null);
            // Create an action row with navigation buttons
            if (bottles.length < 10) {
                return interaction.reply({ content: '', embeds: [embed], ephemeral: true });
            }
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('bottlePage_1')
                        .setLabel('Suivant')
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Secondary),
                );
            return interaction.reply({ content: '', embeds: [embed], components: [row], ephemeral: true });
        } else {
            let bottle;
            const bottles = await bottleDB.getBottleForUserWithName(interaction.user.id, interaction.options.getString('nom'));
            if (bottles.length === 0) {
                try {
                    bottle = await bottleDB.getBottle(interaction.options.getString('nom'));
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
                    message += '📨 **Vous :** ' + messageDB.content + '\n';
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
            if (bottle.archived) {
                status = '🗄️archivée, ';
            }
            if (bottle.id_user_sender === interaction.user.id) {
                status += '📨 en attente de votre réponse';
            } else {
                status += '📥 en attente de réponse de votre correspondant';
            }
            if (bottle.terminated) {
                status = '💀 terminée';
            }
            message += '\n**Statut** : ' + status + '\n';
            const embed = createEmbeds.createFullEmbed(bottle.name, message, null, null, 0x2f3136, null);
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        }
    },
};