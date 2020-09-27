const { Message } = require("discord.js");
const {users, saveUser} = require('../main.js');
const {casings} = require('../utils/printer/component/casing.js')
const {printers} = require('../utils/printer/component/printer.js')

module.exports = {
    name: 'start',
    description: 'Start the adventure',
    /**
     * @param {Message} commandEvent
     */
    execute: function(commandEvent){
        if(users.has(commandEvent.author.id)){
            commandEvent.reply('You already have an account');
        }else{
            const userData = {
                "id": commandEvent.author.id,
                "money": 0,
                "rack": {
                    "level": 1,
                    "printer": [
                        {
                            "name": "Basic Printer",
                            "maxStorage": 10000,
                            "money": 0,
                            "gain": 10,
                            "level": 1
                        }
                    ]
                },
                "component": {
                    "casing": {

                    },
                    "printer": {

                    }
                }
            };
            Object.keys(casings).forEach(key => {
                userData.component.casing[key] = {
                    number: 0
                };
            });
            Object.keys(printers).forEach(key => {
                userData.component.printer[key] = {
                    number: 0
                };
            });
            users.set(commandEvent.author.id, userData);
            saveUser(commandEvent.author.id);
            commandEvent.channel.send('You created an account');
        }
    }
}