const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const wantedDB = require("../database/wanted");
const {wantedChannel} = require("../config.json");
const roles = require("../utils/roles");

module.exports = {
    name: 'replyWanted',
    async execute(interaction) {
        
        const type = interaction.customId.split('_')[1];

        if (type === 'join') {
            const id_channel = interaction.channelId;
            const channel = await interaction.guild.channels.fetch(id_channel);

            const id_user = await wantedDB.get_id_user_response(interaction.message.id);
            const wanted = await wantedDB.get_wanted(interaction.channelId);
            const nb_replies = wanted.nb_replies;
            
            if (!await roles.userIsBooster(interaction.member)) {
                if (nb_replies >= 10 && await roles.userIsVip(interaction.member)) {
                    return await interaction.reply({ content: 'Vous avez déjà invité 10 personnes à rejoindre cet avis de recherche, pour en inviter plus : devenez BOOSTER !', ephemeral: true });
                } else if (nb_replies >= 3 && !await roles.userIsVip(interaction.member)) {
                    return await interaction.reply({ content: 'Vous avez déjà invité 3 personnes à rejoindre cet avis de recherche, pour en inviter plus : devenez VIP !', ephemeral: true });
                }
            }
            await wantedDB.addReply(id_channel);


            const user_member = await interaction.guild.members.fetch(id_user);
            await channel.permissionOverwrites.create(id_user, { ViewChannel: true, SendMessages: true });
            await channel.permissionOverwrites.create(interaction.member.id, { ViewChannel: true, SendMessages: true });
            
            const listMessageIds = await wantedDB.getAllReplies(id_channel);
            for (let i = 0; i < listMessageIds.length; i++) {
                const message = await interaction.channel.messages.fetch(listMessageIds[i].id_message);
                if (listMessageIds[i].id_message === interaction.message.id) {  
                    await message.edit({ content: 'Message de ' + user_member.toString(), embeds: message.embeds, components: [] });
                } else {
                    await message.edit({ content: '', embeds: message.embeds, components: message.components });
                }
            }
            await wantedDB.setArchived(id_channel);
            return await interaction.reply({ content: 'Vous avez invité ' + user_member.toString() + ' à rejoindre le salon.' });
        }

        const modal = new ModalBuilder()
            .setCustomId('replyWanted' + '_' + type)
            .setTitle('Ma réponse');

        // Add components to modal
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('textWanted')
            .setLabel("Quel est votre message ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(2000);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const primaryActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        // Add inputs to the modal
        modal.addComponents(primaryActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};