const bottle = require("../utils/bottleAction");

let semaphore = [];

module.exports = {
    name: 'createBottle',
    async execute(interaction) {

        if (semaphore.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'Vous avez déjà une bouteille en cours de création !', ephemeral: true });
        }

        semaphore.push(interaction.user.id);

        const content = interaction.fields.getTextInputValue('textBottle');

        const sender = interaction.member;

        await interaction.reply({ content: 'Votre bouteille a été envoyée.', ephemeral: true });

        try {
            await bottle.create(interaction.guild, sender.id, content, 0);
        } catch (e) {
            console.log(e);
        }

        semaphore = semaphore.filter(item => item !== interaction.user.id);
    },
};