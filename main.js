'use strict';
const fs = require('fs');
const discord = require('discord.js');
const logger = require('./logger.js');

const {token, owner_id} = require('./config.json');
const {casings} = require('./utils/printer/component/casing.js')
const {printers} = require('./utils/printer/component/printer.js')

// Creating the client
const bot = new discord.Client();

// Data var init
const guilds = new Map();
/**
 * @param {any} guildId
 */
function saveGuild(guildId){
    fs.writeFile(`data/guilds/${guildId}.json`, JSON.stringify(guilds.get(guildId)), (err) =>{if (err) logger.log(logger.logType.ERROR, err.message)});
}

const userFiles = fs.readdirSync('./data/users').filter(file => file.endsWith('.json'));
const users = new Map();
userFiles.forEach(userFile => {
    const userData = require(`./data/users/${userFile}`);
    Object.keys(casings).forEach(key => {
        if(!userData.component.casing.hasOwnProperty(key)){
            userData.component.casing[key] = {
                number: 0
            };
        }
    });
    Object.keys(printers).forEach(key => {
        if(!userData.component.printer.hasOwnProperty(key)){
            userData.component.printer[key] = {
                number: 0
            };
        }
    });
    users.set(userFile.slice(0, -5), userData);
});
setInterval(() => {
    users.forEach(user => {
        user.rack.printer.forEach(printer => {
            if(!(printer.money+printer.gain > printer.maxStorage)){
                printer.money+=printer.gain;
            }
            saveUser(user.id)
        });
    });
}, 10000);
/**
 * @param {any} userId
 */
function saveUser(userId){
    if(users.has(userId)) {
        fs.writeFile(`data/users/${userId}.json`, JSON.stringify(users.get(userId)), (err) =>{if (err) logger.log(logger.logType.ERROR, err.message)});
    }
    return users.has(userId);
}

// Registering commands
const commandFiles = []
getCommandFiles('./commands');
function getCommandFiles(dir){
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if(file.endsWith('.js')){
            commandFiles.push(`${dir}/${file}`);
        }else{
            getCommandFiles(`${dir}/${file}`)
        }
    });
}
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Map();
module.exports = {guilds, saveGuild, users, saveUser, commands};
commandFiles.forEach(commandFile => {
    const command = require(commandFile);
    var commandName = command.name != null ? command.name : 'NONE'
    var commandDescription = command.description != null ? command.description : 'NONE';
    var commandOwerOnly = command.ownerOnly != null ? command.ownerOnly : false;
    logger.log(logger.logType.INFO, `Command added ${commandName}`);
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
    // @ts-ignore
    if(!msg.content.startsWith(guilds.get(msg.guild.id).prefix) || msg.author.bot) return;

    // @ts-ignore
    const commandName = msg.content.slice(guilds.get(msg.guild.id).prefix.length).trim().split(/ +/);
    if(!commands.has(commandName[0])) return;
    var command = commands.get(commandName[0].toLowerCase());
    if(command == null) return;
    
    // @ts-ignore
    logger.log(logger.logType.INFO, `Server: ${msg.guild.name} - ${msg.author.tag}: ${msg.content}`)

    if(command.ownerOnly)
        if(msg.author.id === owner_id)
            msg.reply(`${commandName[0]} is a bot owner command and you are not the bot owner`);

    command.execute(msg);

});

bot.on('ready', () => {
    // Data loading

    // Guild Data
    // @ts-ignore
    bot.guilds.cache.forEach((guild) => {
        var guildData;
        if(fs.existsSync(`./data/guilds/${guild.id}.json`)) {
            guildData = require(`./data/guilds/${guild.id}.json`);
        } else {
            guildData = {
                "prefix": "<",
            };
            fs.writeFile(`data/guilds/${guild.id}.json`, JSON.stringify(guildData), (err) =>{if (err) logger.log(logger.logType.ERROR, err.message)});
        }
        guilds.set(guild.id, guildData);
    });
    // User Data
    /*bot.users.cache.forEach((user) => {
        var userData;
        if(fs.existsSync(`./data/users/${user.id}.json`)){
            userData = require(`./data/users/${user.id}.json`);
        }else{
            userData = {
                "id": "",
                "rack": {
                    "level": 1,
                    "printer": {
                        "1": {
                            "name": "Base Printer",
                            "maxStockage": 1000,
                            "money": 0,
                            "level": 1
                        }
                    }
                }
            };
            fs.writeFile(`data/users/${user.id}.json`, JSON.stringify(userData), (err) =>{if (err) logger.log(logger.logType.ERROR, err.message)});
        }
        users.set(user.id, userData);
    });*/

    // TODO Users Data

    logger.log(logger.logType.INFO, 'Ready');
});

bot.on('guildCreate', guild =>{
    var guildData
    if(fs.existsSync(`./data/guilds/${guild.id}.json`)) {
        guildData = require(`./data/guilds/${guild.id}.json`);
    } else {
        guildData = {
            "prefix": "<",
        };
        fs.writeFile(`data/guilds/${guild.id}.json`, JSON.stringify(guildData), (err) =>{if (err) logger.log(logger.logType.ERROR, err.message)});
    }
    guilds.set(guild.id, guildData);
});

bot.on('error', error => logger.log(logger.logType.ERROR, error.message));
bot.on('warn', warn => logger.log(logger.logType.WARNING, warn));
bot.on('debug', debug => logger.log(logger.logType.INFO, debug));

// Launching the bot
bot.login(token);