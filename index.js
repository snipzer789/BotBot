const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Check_Server_exist, Load_server_settings, Log_message } = require('./message_logger/message_logger.js');
const fs = require('node:fs');
const path = require('node:path');

const Discord_Token = process.env.Discord_Token;

const Discord_Client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

Current_Dir = fs.readdirSync('./');
// console.log(CurrentDir);
if (!Current_Dir.includes('servers')) {
	console.log('Servers folder not found. Making new folder');
	fs.mkdirSync('./servers');
}

Discord_Client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			Discord_Client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

Discord_Client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

Discord_Client.login(Discord_Token);

Discord_Client.once(Events.ClientReady, (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

Discord_Client.on(Events.GuildCreate, (GuildCreate) => {
	Server_Dir = fs.readdirSync('./servers');
	if (Check_Server_exist) {
		return;
	}
	fs.mkdirSync(`./servers/${GuildCreate.id}`);
	fs.writeFileSync(`./servers/${GuildCreate.id}/Config.yaml`, '{}');
});

Discord_Client.on(Events.MessageCreate, (message) => {
	if (!Check_Server_exist(message.guildId)) {
		return;
	}
    console.log('guild found');
    
    if (message.author.bot){
        return;
    }
    console.log('author is not a bot')

    let Server_config = Load_server_settings(message.guildId);
	if (!Server_config.Message_logger.Message_logger_enable) {
		return;
	}
	console.log('Logger enabled');
	
    if (Server_config.Message_logger.Message_logger_id == '') {
		return;
	}
    console.log('Log channel found');
	let Outgoing_message = Log_message(message, Server_config);

    if (Outgoing_message != '') {
		const Logs_channel = Discord_Client.channels.cache.get(Server_config.Message_logger.Message_logger_id);
		console.log(Outgoing_message);
		if (Outgoing_message.includes('SPOILER')) {
			Logs_channel.send({
				content: Outgoing_message,
				flags: [4096, 4],
			});
		} else {
			Logs_channel.send({
				content: Outgoing_message,
				flags: [4096],
			});
		}
		return;
	}
});