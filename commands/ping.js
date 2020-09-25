const { Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Give bot ping',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        const ping = commandEvent.client.ws.ping;
        const title = `P${'o'.repeat(Math.ceil(ping/1000))}ng...`;
        const embed = new MessageEmbed()
            .addField(title, `${ping}ms`);
        commandEvent.channel.send(embed);
    }
}