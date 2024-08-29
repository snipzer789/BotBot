const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logger')
		.setDescription('Logs all messages sent in the server in a channel')
		.addBooleanOption((option) => option.setName('switch').setDescription('Enables or disables message logger')),
	async execute(interaction) {
		const state = interaction.options.getString('switch');
		await interaction.reply('Log server set ' + state);
	},
};
