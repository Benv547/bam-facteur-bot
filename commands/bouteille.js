const { SlashCommandBuilder } = require('discord.js');
const bottleDB = require("../database/bottle");
const messageDB = require("../database/message");
const createEmbeds = require("../utils/createEmbeds");

module.exports = {
    public: true,
    data: new SlashCommandBuilder()
        .setName('bottle')
        .setDescription('Check your bottles!')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the bottle')),
    async execute(interaction) {
        if (interaction.options.getString('name') === null) {
            const bottles = await bottleDB.getBottleForUser(interaction.user.id);
            let message = '';
            if (bottles.length === 0) {
                message = 'You have no bottle!';
            } else {
                message += '📥 awaiting for an answer from your correspondent';
                message += '\n';
                message += '📨 awaiting your response';
                message += '\n';
                message += '💀 finished bottle';
                message += '\n';
                message += '🗄️ archived bottle';
                message += '\n\n'

                bottles.forEach(bottle => {
                    message += '• **' + bottle.name + '**\n';
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
                    message += '**Status**: ' + status + '\n\n';
                });
            }
            const embed = createEmbeds.createFullEmbed("Your bottles", message, null, null, 0x2f3136, null);
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        } else {
            let bottle;
            const bottles = await bottleDB.getBottleForUserWithName(interaction.user.id, interaction.options.getString('name'));
            if (bottles.length === 0) {
                try {
                    bottle = await bottleDB.getBottle(interaction.options.getString('name'));
                }
                catch (e) {
                    return interaction.reply({content: 'This bottle doesn\'t exist.', ephemeral: true});
                }

                if (bottle === null) {
                    return interaction.reply({content: 'This bottle doesn\'t exist.', ephemeral: true});
                }

                if (bottle.id_user_sender !== interaction.user.id && bottle.id_user_receiver !== interaction.user.id) {
                    return interaction.reply({content: 'This bottle doesn\'t exist.', ephemeral: true});
                }
            } else if (bottles.length > 1) {
                return interaction.reply({content: 'Several bottles have this name, please specify.', ephemeral: true});
            } else {
                bottle = bottles[0];
            }

            let message = '';

            const messages = await messageDB.getMessagesOfBottle(bottle.id_bottle);
            messages.forEach(messageDB => {
                if (messageDB.id_user === interaction.user.id) {
                    message += '📨 **You:** ' + messageDB.content + '\n';
                } else {
                    message += '📥 **Your correspondent:** ' + messageDB.content + '\n';
                }
            });

            // if the message.length is too long
            if (message.length > 2000) {
                // cut the message
                message = message.substring(0, 1950);
                // add a ... at the end
                message += '... (message too long)\n';
            }

            let status = '';
            if (bottle.archived) {
                status = '🗄️archived, ';
            }
            if (bottle.id_user_sender === interaction.user.id) {
                status += '📨 awaiting your response';
            } else {
                status += '📥 awaiting for an answer from your correspondent';
            }
            if (bottle.terminated) {
                status = '💀 finished';
            }
            message += '\n**Status**: ' + status + '\n';
            const embed = createEmbeds.createFullEmbed(bottle.name, message, null, null, 0x2f3136, null);
            return interaction.reply({content: '', embeds: [embed], ephemeral: true});
        }
    },
};