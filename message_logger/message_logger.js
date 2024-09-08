const fs = require('node:fs');
const { remove_linebreaks } = require('../functions/Misc.js');

const Check_Server_exist = (Server_id) => {
	const servers_dir = fs.readdirSync(`./servers`);
	if (servers_dir.includes(`${Server_id}`)) {
		return true;
	} else {
		return false;
	}
};

/*
0: Message.id
1: Time_stamp_sec
2: Parsed_content
3: Message_attachment
4: Message_reply
5: Message.author.username
6: Mentioned_users
7: Mentioned_roles
8: Message_length
*/

const Log_message = (Message, Server_config, Guild_Id, Channel_Id) => {
	let Parsed_message = Parse_discord_message(Message);

	let Message_Logged
	let Filtered_message
	// https://discord.com/channels/1048977410755940392/1278137332586909756/1281393672470138941
	Message_Logged = `<t:${Parsed_message[1]}:T> In https://discord.com/channels/${Guild_Id}/${Channel_Id}/${Parsed_message[0]} | ${Filtered_message} | Reply to: ${Parsed_message[4]}`

	console.log(Message_Logged)
	fs.writeFileSync(`./Logs.txt`, `${Parsed_message}`);
	return Message_Logged;
};

const Parse_discord_message = (Message) => {
	let Parsed_content = '';
	let Message_attachment = '';
	let Message_reply = '';
	let Mentioned_users = '';
	let Mentioned_roles = '';
	let Message_length = 0;

	// input santitising because alot can break csv's
	Parsed_content = Message.content;
	Parsed_content = Parsed_content.replace(/,/g, ' ');
	Parsed_content = Parsed_content.replace(/"/g, ' ');
	Parsed_content = remove_linebreaks(Parsed_content);

	// attachments
	let attachment_array = Message.attachments.map((x) => JSON.stringify(x.url));
	if (attachment_array.length > 1) {
		Message_attachment = attachment_array.join(' ¬ ');
	} else if (attachment_array.length == 1) {
		Message_attachment = attachment_array[0];
	}

	// checking if a message was a reply or not
	if (Message.mentions.repliedUser != null) {
		Reply = `${Message.mentions.repliedUser.username} ¬ ${Message.mentions.repliedUser}`;
	}

	// saves mentioned users for replacement
	let Mentions_username_array = [];
	let Mentions_Id_array = [];
	if (Message.mentions.users != null) {
		Mentions_username_array = Message.mentions.users.map((x) => JSON.stringify(x.username));
		Mentions_Id_array = Message.mentions.users.map((x) => JSON.stringify(x.id));

		let Number_of_mentions = Mentions_username_array.length;
		for (let i = 0; i < Number_of_mentions; i++) {
			Mentioned_users = Mentioned_users + `${Mentions_username_array[i].split('"')[1]}$${Mentions_Id_array[i].split('"')[1]} ¬ `;
		}
	}

	// saves mentioned roles
	let Mentions_role = [];
	let Mentions_role_Id = [];
	if (Message.mentions.roles != null) {
		Mentions_role = Message.mentions.roles.map((x) => JSON.stringify(x.name));
		Mentions_role_Id = Message.mentions.roles.map((x) => JSON.stringify(x.id));

		let Number_of_mentions = Mentions_role.length;
		for (let i = 0; i < Number_of_mentions; i++) {
			Mentioned_roles = Mentioned_roles + `${Mentions_role[i].split('"')[1]}$${Mentions_role_Id[i].split('"')[1]} ¬ `;
		}
	}

	// roles
	if (Message.mentions.repliedUser != null) {
		Message_reply = Message.mentions.repliedUser.username;
	} else {
		Message_reply = '';
	}

	let Time_stamp_sec = Math.floor(Message.createdTimestamp/1000)
	let Parsed_discord_message = [];
	Parsed_discord_message.push(Message.id);
	Parsed_discord_message.push(Time_stamp_sec);
	Parsed_discord_message.push(Parsed_content);
	Parsed_discord_message.push(Message_attachment);
	Parsed_discord_message.push(Message_reply);
	Parsed_discord_message.push(Message.author.username);
	Parsed_discord_message.push(Mentioned_users);
	Parsed_discord_message.push(Mentioned_roles);
	Parsed_discord_message.push(Message_length);
	return Parsed_discord_message;
};

module.exports = { Check_Server_exist, Log_message };
