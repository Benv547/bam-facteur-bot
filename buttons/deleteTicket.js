const ticketDB = require("../database/ticket");
require("../utils/createEmbeds");

module.exports = {
    name: 'deleteTicket',
    async execute(interaction) {
        // Check if channel exists
        if (interaction.guildId === null) {
            // Fetch channel from database
            const channelId = await ticketDB.get_id_channel(interaction.user.id);
            if (channelId == null) {
                return await interaction.reply({ content: 'Votre ticket est introuvable ou a déjà été fermé. Merci d\'en créer un nouveau.', ephemeral: true });
                return;
            }

            // Fetch guild from database
            const guildId = await ticketDB.get_id_guild(interaction.user.id);

            // Fetch guild from client
            const guild = await interaction.client.guilds.fetch(guildId);

            // Fetch channel from guild
            const channelGuild = await guild.channels.fetch(channelId);

            // Delete channel
            try {
                // Delete ticket from database
                await ticketDB.deleteTicket(channelId);
                await channelGuild.delete();
            } catch (e) {
                console.error(e);
                return await interaction.reply({ content: 'Une erreur est survenue lors de la suppression du ticket.', ephemeral: true });
            }
            return await interaction.reply({ content: 'Le ticket a été supprimé.', ephemeral: true });
        } else {
            // Fetch user from database
            try {
                const user = await ticketDB.get_id_user(interaction.channel.id);
                // Fetch user from guild
                const userGuild = await interaction.guild.members.fetch(user);
                // Send an MP message to the sender
                await userGuild.send({ content: 'Votre ticket a été fermé.' });
            } catch {}

            // Delete channel
            try {
                // Delete ticket from database
                await ticketDB.deleteTicket(interaction.channel.id);
                await interaction.channel.delete();
            } catch (e) {
                console.error(e);
                return await interaction.reply({ content: 'Une erreur est survenue lors de la suppression du ticket.', ephemeral: true });
            }
            return await interaction.reply({ content: 'Le ticket a été supprimé.', ephemeral: true });
        }
    },
};