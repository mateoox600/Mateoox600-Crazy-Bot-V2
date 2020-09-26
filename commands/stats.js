const { Message, MessageEmbed } = require('discord.js');
const { owner_id } = require('../config.json');

module.exports = {
    name: 'stats',
    description: 'Give bot stats',
    /**
     * @param {Message} commandEvent
     */
    execute: async function(commandEvent){
        const botOwner = await commandEvent.client.users.fetch(owner_id);

        const categoryChannels = commandEvent.client.channels.cache.filter(channel => channel.type === 'category').size;
        const textChannels = commandEvent.client.channels.cache.filter(channel => channel.type === 'text' || channel.type === 'news').size;
        const voiceChannels = commandEvent.client.channels.cache.filter(channel => channel.type === 'voice').size;
        const channels = categoryChannels+textChannels+voiceChannels;

        const onlineUsers = commandEvent.client.users.cache.filter(user => !user.bot && (user.presence.status === 'online' || user.presence.status === 'dnd')).size;
        const offlineUsers = commandEvent.client.users.cache.filter(user => !user.bot && (user.presence.status === 'offline' || user.presence.status === 'idle')).size;
        const users = onlineUsers+offlineUsers;

        const embed = new MessageEmbed()
            .setTitle('Mateoox600 Crazy Bot V.2')
            .setFooter(`Bot creator: ${botOwner.tag}`, botOwner.displayAvatarURL())
            .addField('General Stats', `Guilds: ${commandEvent.client.guilds.cache.size}`, true)
            .addField(`Channels: ${channels}`, `Categories: ${categoryChannels} \nText Channels: ${textChannels} \nVoice Channels: ${voiceChannels}`, true)
            .addField(`Users: ${users}`, `Online Users: ${onlineUsers} \nOffline Users: ${offlineUsers}`, true);
        commandEvent.channel.send(embed);
    }
}