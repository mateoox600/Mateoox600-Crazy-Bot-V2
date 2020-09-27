const { Message, MessageEmbed } = require("discord.js");
const {users, saveUser} = require('../main.js');

module.exports = {
    name: 'rack',
    description: 'See your rack',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        if(!users.has(commandEvent.author.id)){
            commandEvent.reply('You don\'t have an account');
        }else{
            const userData = users.get(commandEvent.author.id);
            const embed = new MessageEmbed().setTitle('Rack').setColor(commandEvent.member.roles.highest.color).addField('Level', userData.rack.level);
            var printerId = 0;
            userData.rack.printer.forEach(printer => {
                embed.addField(`**Printer ${printerId+1}**`, `**Name**: ${printer.name} \n**Money**: ${printer.money}/${printer.maxStorage} \n**Level**: ${printer.level} \n**Money Per 10Seconds**: ${printer.gain}`, true);
                printerId++;
            });
            const fields = embed.fields.length;
            for (let i = 0; i < userData.rack.level-1+2-fields-1; i++) {
                embed.addField(`**Printer ${printerId+i+1}**`, 'Empty', true);
            }
            commandEvent.channel.send(embed);
        }
    }
}