const bottle = require("../utils/bottleAction");

module.exports = {
    name: 'createBottle',
    async execute(interaction) {

        if (global.semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'Vous avez déjà une bouteille en cours de création !', ephemeral: true });
        }

        try {

            global.semaphore.push(interaction.user.id);

            const content = interaction.fields.getTextInputValue('textBottle');
            if (content.trim() === '') {
                return await interaction.reply({content: "Le message ne peut pas être vide.", ephemeral: true});
            }

            const sender = interaction.member;

            await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });

            try {
                await bottle.create(interaction.guild, sender.id, content, 0);
            } catch (e) {
                console.log(e);
            }

        } finally {
            global.semaphore = global.semaphore.filter(item => item !== interaction.user.id);
        }
    },
};