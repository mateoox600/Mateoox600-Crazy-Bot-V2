const { Message, MessageEmbed } = require('discord.js');
const {guilds, saveGuild} = require('../main.js');

module.exports = {
    name: 'prefix',
    description: 'Prefix Management for the server',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        const args = commandEvent.content.split(/ +/g);
        if(args.length <= 1){
            // @ts-ignore
            commandEvent.channel.send(new MessageEmbed().addField('Prefix:', guilds.get(commandEvent.guild.id).prefix));
        }else{
            // @ts-ignore
            guilds.get(commandEvent.guild.id).prefix = args[1];
            // @ts-ignore
            commandEvent.channel.send(new MessageEmbed().addField('New Prefix:', guilds.get(commandEvent.guild.id).prefix));
            // @ts-ignore
            saveGuild(commandEvent.guild.id);
        }
    }
}