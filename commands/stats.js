const { Message, MessageEmbed } = require('discord.js');
const { owner_id } = require('../config.json');

module.exports = {
    name: 'stats',
    description: 'Give bot stats',
    /**
     * @param {Message} commandEvent
     */
    execute: async function(commandEvent){
        var botOwner = await commandEvent.client.users.fetch(owner_id);
        const embed = new MessageEmbed()
            .setTitle('Mateoox600 Crazy Bot')
            .setFooter(`Bot creator: ${botOwner.tag}`, botOwner.displayAvatarURL())
            .addField('General Stats', `Guilds: ${commandEvent.client.guilds}`);
        commandEvent.channel.send(embed);
    }
}