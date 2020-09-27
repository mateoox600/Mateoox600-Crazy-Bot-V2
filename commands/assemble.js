const { Message } = require('discord.js');
const {users, saveUser} = require('../main.js');
const {casings} = require('../utils/printer/component/casing.js')
const {printers} = require('../utils/printer/component/printer.js')
const printerUtils = require('../utils/printer/printerUtils.js');

module.exports = {
    name: 'assemble',
    description: 'Assemble things to do things.. with things',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        const args = commandEvent.content.split(/ +/g);
        if(!users.has(commandEvent.author.id)){
            commandEvent.reply('You don\'t have an account');
        }else{
            const user = users.get(commandEvent.author.id);
            if(args.length >= 2){
                if(args[1].toLowerCase() === 'printer'){
                    if(args.length >= 4){
                        if(user.rack.printer.length + 1 > user.rack.level-1+2){
                            commandEvent.reply('Error: your rack is full upgrade it to assemble more printers');
                            return;
                        }
                        const casing = casings[args[2]];
                        const printer = printers[args[3]];
                        if(casing == null || printer == null) {
                            commandEvent.reply('Error: the casing of the printer you give don\'t exist');
                            return;
                        }
                        const assembledPrinter = printerUtils.createPrinter(casing, printer);
                        if(user.component.casing[args[2]].number<1 && user.component.printer[args[3]].number<1){
                            commandEvent.reply('Error: you don\'t have enough of those component');
                            return;
                        }
                        user.component.casing[args[2]].number--;
                        user.component.printer[args[3]].number--;
                        user.rack.printer.push(assembledPrinter);
                        commandEvent.reply(`You assembled a ${assembledPrinter.name}`);
                    }else{
                        commandEvent.reply('Error: `assemble <printer> <casing> <printer>`');
                    }
                }else{
                commandEvent.reply('Error: `assemble <printer> <casing> <printer>`');
                }
            }else{
                commandEvent.reply('Error: `assemble <printer> <casing> <printer>`');
            }
        }
    }
}