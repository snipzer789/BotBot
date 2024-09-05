const fs = require('node:fs');

const { Load_server_settings } = require('./Misc');

//
let Complaint_logger_enable = false;
let Message_logger_id = null;
//
let Live_announcements_enable = false;
let Twitch_Youtube = null;
let Live_channel_url = null;
let Live_channel_id = null;
let Last_live_url = null;
//
let Support_enable = false;
let Support_channel_id = null;
let Support_role = null;
//
let Error_log_channel = null;

const Config_base_setup = (Complaint_logger_enable, Message_logger_id, Live_announcements_enable, Twitch_Youtube, Live_channel_url, Live_channel_id, Last_live_url, Support_enable, Support_channel_id, Support_role, Error_log_channel) => {
	
    
    
    
    const Config_base = `
Message_logger:
    Message_logger_enable: ${Complaint_logger_enable}
    Message_logger_id: "${Message_logger_id}"
Live_announcements:
    Live_announcements_enable: ${Live_announcements_enable}
    Twitch_Youtube: ${Twitch_Youtube}
    Live_channel_url: "${Live_channel_url}"
    Live_channel_id: "${Live_channel_id}"
    Last_live_url: "${Last_live_url}"
Support_tickets:
    Support_enable: ${Support_enable}
    Support_channel_id: "${Support_channel_id}"
    Support_role: "${Support_role}"
Bot_settings:
    Error_log_channel: "${Error_log_channel}"`;
	return Config_base;
};

const Create_Config = (Server_id) => {
    let Config_base = Config_base_setup(false, '', false, '', '', '', '', false, '', '', '', '')
	fs.writeFileSync(`./servers/${Server_id}/Config.yml`, `${Config_base}`);
};

const Complaint_enable = (Complaint_enable, Complaint_id, Server_id) => {
	const Server_Settings = Load_server_settings(Server_id);
    //
	Complaint_logger_enable = Complaint_enable;
	Message_logger_id = `${Complaint_id}`;
	//
	Live_announcements_enable = Server_Settings.Live_announcements.Live_announcements_enable
	Twitch_Youtube = `${Server_Settings.Live_announcements.Twitch_Youtube}`
    Live_channel_url = `${Server_Settings.Live_announcements.Live_channel_url}`
    Live_channel_id = `${Server_Settings.Live_announcements.Live_channel_id}`
    Last_live_url = `${Server_Settings.Live_announcements.Last_live_url}`
    //
	Support_enable = Server_Settings.Support_tickets.Support_enable
	Support_channel_id = `${Server_Settings.Support_tickets.Support_channel_id}`
    Support_role = `${Server_Settings.Support_tickets.Support_role}`
    //
    Error_log_channel = `${Server_Settings.Bot_settings.Error_log_channel}`

	let Config_updated = Config_base_setup(Complaint_logger_enable, Message_logger_id, Live_announcements_enable, Twitch_Youtube, Live_channel_url, Live_channel_id, Last_live_url, Support_enable, Support_channel_id, Support_role, Error_log_channel);
	fs.writeFileSync(`./servers/${Server_id}/Config.yml`, `${Config_updated}`);
};

module.exports = { Create_Config, Complaint_enable };
