const { Message, MessageEmbed } = require('discord.js');
const {commands} = require('../main.js');

module.exports = {
    name: 'help',
    description: 'Give list of commands with their use',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        // @ts-ignore
        const embed = new MessageEmbed().setTitle('Mateoox600 Crazy Bot V.2 Help').setFooter(`For additional help please contact Mateoox600#9473`).setColor(commandEvent.member.roles.highest.color);
        var commandsText = '';
        commands.forEach(command => {
            commandsText += `\`${command.name}\` - ${command.ownerOnly?'Bot Owner Command:':''} ${command.description}\n`;
        });
        embed.addField('Commands (1/1)', commandsText);
        commandEvent.channel.send(embed);
    }
}