const { signalement, modRole, sanction, wantedChannel} = require("../config.json");
const messageDB = require("../database/message");
const bottleDB = require("../database/bottle");
const signalementDB = require("../database/signalement");
const wantedDB = require("../database/wanted");
const birdDB = require("../database/bird");
const ticketDB = require("../database/ticket");
const sanctionDB = require("../database/sanctions");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const createEmbeds = require("../utils/createEmbeds");
const sanctionsDB = require("../database/sanctions");

module.exports = {
    name: 'sanction',
    async execute(interaction) {

        const sanctionType = interaction.customId.split('_')[1];

        const raison = interaction.fields.getTextInputValue('raison');
        const mod = interaction.member;

        // Get signalement
        const signalement = await signalementDB.getSignalement(interaction.message.id);
        if (signalement === null) {
            return await interaction.reply({content: "Impossible de faire cela.", ephemeral: true});
        }

        // Get sender id
        const id_sender = signalement.id_sender;
        const sender = await interaction.guild.members.fetch(id_sender);

        // Get receiver id
        const id_receiver = signalement.id_receiver;
        const receiver = await interaction.guild.members.fetch(id_receiver);

        // set title and apply sanction
        let title;
        let description = 'Une de vos actions a été jugée comme inappropriée par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**';
        if (sanctionType === 'ban') {
            title = 'Vous avez été banni•e';
            try {
                await receiver.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: raison });
            } catch (error) {
                console.log(error);
            }
        } else if (sanctionType === 'warn' || sanctionType === 'abusif') {
            title = 'Vous avez été averti•e';
        } else if (sanctionType === 'mute') {
            const timeout = parseInt(interaction.fields.getTextInputValue('timeout'));
            title = 'Vous avez été mute pour ' + timeout + ' minutes';
            // Mute receiver
            try {
                await receiver.timeout(parseInt(timeout) * 60 * 1000, raison);
            } catch (error) {
                console.log(error);
            }
        }

        if (signalement.type === 'bottle') {
            const signalementBottle = await signalementDB.getSignalementBottle(interaction.message.id);
            const id_bottle = signalementBottle.id_bottle;
            try {
                const bottle = await interaction.guild.channels.fetch(id_bottle);
                await bottle.delete();
            } catch {}
            await bottleDB.setBottleArchived(id_bottle);
            await bottleDB.setBottleTerminated(id_bottle);
        } else if (signalement.type === 'wanted') {
            if (sanctionType !== 'abusif') {
                const signalementWanted = await signalementDB.getSignalementWanted(interaction.message.id);
                const id_wanted = signalementWanted.id_message_wanted;

                const wantedChann = await interaction.guild.channels.fetch(signalementWanted.id_channel);
                await wantedChann.delete();

                const globalWantedC = await interaction.guild.channels.fetch(wantedChannel);
                const wanted = await globalWantedC.messages.fetch(id_wanted);
                await wantedDB.deleteWanted(signalementWanted.id_channel);
                await wanted.delete();
            }
        } else if (signalement.type === 'wantedReply') {
            const signalementWanted = await signalementDB.getSignalementWanted(interaction.message.id);
            const id_wanted = signalementWanted.id_message_wanted;

            const globalWantedC = await interaction.guild.channels.fetch(signalementWanted.id_channel);
            const wanted = await globalWantedC.messages.fetch(id_wanted);
            await wanted.delete();
        } else if (signalement.type === 'ticket') {
            const signalementTicket = await signalementDB.getSignalementTicket(interaction.message.id);
            const id_channel = signalementTicket.id_channel;

            const ticket = await interaction.guild.channels.fetch(id_channel);
            await ticketDB.deleteTicket(id_channel);
            await ticket.delete();
        } else if (signalement.type === 'suggestion') {
            if (sanctionType !== 'abusif') {
                const signalementSuggestion = await signalementDB.getSignalementSuggestion(interaction.message.id);
                const channel = await interaction.guild.channels.fetch(signalementSuggestion.id_channel);
                const message = await channel.messages.fetch(signalementSuggestion.id_message_suggestion);
                await message.delete();
            }
        } else if (signalement.type === 'help') {
            if (sanctionType !== 'abusif') {
                const signalementHelp = await signalementDB.getSignalementHelp(interaction.message.id);
                const channel = await interaction.guild.channels.fetch(signalementHelp.id_channel);
                const message = await channel.messages.fetch(signalementHelp.id_message_help);
                await message.delete();
            }
        } else if (signalement.type === 'bird') {
            if (sanctionType !== 'abusif') {
                const signalementBird = await signalementDB.getSignalementBird(interaction.message.id);
                const channel = await interaction.guild.channels.fetch(signalementBird.id_channel);
                await channel.delete();
                await birdDB.deleteBird(signalementBird.id_channel);
            }
        } else if (signalement.type === 'message_ile') {
            if (sanctionType !== 'abusif') {
                const signalementMessageIle = await signalementDB.getSignalementIleMessage(interaction.message.id);
                const channel = await interaction.guild.channels.fetch(signalementMessageIle.id_channel);
                const message = await channel.messages.fetch(signalementMessageIle.id_message_ile);
                await message.delete();
            }
        }

        if (sanctionType !== 'abusif') {
            //Save the informations in the Sanctions tab
            await sanctionsDB.saveSanction(id_receiver, mod.id, sanctionType, raison);
            try {
                await receiver.send({
                    content: '',
                    embeds: [createEmbeds.createFullEmbed(title, description, null, null, 0x2f3136, null)]
                });
            } catch {}
            // save sanction to channel
            const channel = await interaction.guild.channels.fetch(sanction);
            await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed(sanctionType, 'L\'utilisateur ' + receiver.toString() + ' a été '+ sanctionType +' par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });
        } else {
            //Save the informations in the Sanctions tab
            await sanctionsDB.saveSanction(id_sender, mod.id, sanctionType, raison);
            try {
                await sender.send({
                    content: '',
                    embeds: [createEmbeds.createFullEmbed(title, description, null, null, 0x2f3136, null)]
                });
            } catch {}
            // save sanction to channel
            const channel = await interaction.guild.channels.fetch(sanction);
            await channel.send({ content: '', embeds: [createEmbeds.createFullEmbed(sanctionType, 'L\'utilisateur ' + sender.toString() + ' a été '+ sanctionType +' par ' + mod.toString() + ' pour la raison suivante : **' + raison + '**', null, null, 0x2f3136, null)] });
        }

        await interaction.reply({ content: 'Votre réponse au signalement a été envoyé.', ephemeral: true });
        await interaction.message.delete();
        await signalementDB.deleteSignalement(interaction.message.id);
    }
};