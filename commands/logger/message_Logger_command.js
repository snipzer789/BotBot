const { SlashCommandBuilder } = require('discord.js');

const { Complaint_enable } = require('../../functions/Create_Config.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logger')
		.setDescription('Logs all messages sent in the server in a channel')
		.addBooleanOption((option) => option.setName('switch').setDescription('Enables or disables message logger.').setRequired(true))
		.addChannelOption((option) => option.setName('channel').setDescription('Sets the channel message logs are sent to. (if disabling add random channel)').setRequired(true)),

	async execute(interaction) {
		const Switch_state = interaction.options.getBoolean('switch');
		const Channel_state = interaction.options.getChannel('channel');

		Complaint_enable(Switch_state, Channel_state.id, Channel_state.guild.id);

		if (Switch_state == false) {
			await interaction.reply(`Message Logger, Disabled`);
		} else {
			await interaction.reply(`Message logger, ${Switch_state}, in ${Channel_state.guild.name}`);
		}
	},
};
