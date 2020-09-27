const { Message, MessageEmbed } = require("discord.js");
const {users, saveUser} = require('../../main.js');

module.exports = {
    name: 'claim',
    description: 'Claim printer money',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        if(!users.has(commandEvent.author.id)){
            commandEvent.reply('You don\'t have an account');
        }else{
            const userData = users.get(commandEvent.author.id);
            var moneyClaimed = 0;
            userData.rack.printer.forEach(printer => {
                moneyClaimed += printer.money;
                printer.money = 0;
            });
            userData.money += moneyClaimed;
            commandEvent.channel.send(new MessageEmbed().addField('Claimed', `${moneyClaimed} money`));
            saveUser(commandEvent.author.id);
        }
    }
}