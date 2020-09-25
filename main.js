'use strict';
const fs = require('fs');
const discord = require('discord.js');
const logger = require('./logger.js');
const { name } = require('./commands/ping.js');

const {token, prefix, owner_id} = require('./config.json');

// Creating the client
const bot = new discord.Client();

// Registering commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Map();
commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    var commandName = command.name != null ? command.name : 'NONE'
    var commandDescription = command.description != null ? command.description : 'NONE';
    var commandOwerOnly = command.ownerOnly != null ? command.ownerOnly : false;
    logger.log(logger.logType.INFO, 'Command added: ' + commandName);
    commands.set(commandName, 
        {
        name: commandName,
        description: commandDescription,
        ownerOnly: commandOwerOnly,
        /**
         * @param {discord.Message} commandEvent
         */
        execute: function(commandEvent){
            command.execute(commandEvent);
        }
    });
});

// Adding the events
bot.on('message', msg=>{
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;

    const commandName = msg.content.slice(prefix.length).trim().split(/ +/);
    var command = commands.get(commandName[0].toLowerCase());
    if(command == null) return;
    
    // @ts-ignore
    logger.log(logger.logType.INFO, `Server: ${msg.guild.name} - ${msg.author.tag}: ${msg.content}`)

    if(command.ownerOnly)
        if(msg.author.id === owner_id)
            msg.reply(`${commandName} is a bot owner command and you are not the bot owner`);

    command.execute(msg);

});

bot.on('ready', () => {
    logger.log(logger.logType.INFO, 'Ready');
});

// Launching the bot
bot.login(token);