const yaml = require('yaml');
const fs = require('node:fs')

const remove_linebreaks = (str) => {
	let newstr = '';

	// Looop and traverse string
	for (let i = 0; i < str.length; i++) if (!(str[i] == '\n' || str[i] == '\r')) newstr += str[i];
	return newstr;
};

const Load_server_settings = (Server_id) => {
	const Server_config = fs.readFileSync(`./servers/${Server_id}/Config.yml`, 'utf8');
	Server_config_parsed = yaml.parse(Server_config);
	return Server_config_parsed;
};

module.exports = { remove_linebreaks, Load_server_settings }