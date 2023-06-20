const {memberRole, boostRole, booster} = require('../config.json');
const message = ["Et voici **pseudo** qui nous donne un bon coup de Boost !", "On applaudit tous **pseudo** pour avoir découvert le bouton \"booster ce serveur\"!", "Et voilà **pseudo** qui change de couleur !", "La carte bancaire de **pseudo** vient de lui bruler les doigts, mais on le remercie chaleureusement !", "**pseudo** veut se donner de l'importance en boostant le serveur... Et ça marche !", "Entre nous, **pseudo** est trop sympa quand même...", "Merci **pseudo** pour ce Boost sauvage, on en prendra soin !", "Posternez vous devant **pseudo** le grand Booster !"
];

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        try{
            if (oldMember.pending && !newMember.pending) {
                // add the role!
                newMember.roles.add(memberRole);
            }
            if (oldMember._roles != newMember._roles && !oldMember._roles.includes(boostRole) && newMember._roles.includes(boostRole)){
                (await newMember.guild.channels.fetch(booster)).send(message[Math.floor(Math.random() * message.length)].replace("pseudo", newMember.user.username.charAt(0).toUpperCase() + newMember.user.username.substring(1)));
            }
        } catch (e) {
            console.log(e);
        }
    }
};