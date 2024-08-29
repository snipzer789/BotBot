const remove_linebreaks = (str) => {
	let newstr = '';

	// Looop and traverse string
	for (let i = 0; i < str.length; i++) if (!(str[i] == '\n' || str[i] == '\r')) newstr += str[i];
	return newstr;
};


module.exports = { remove_linebreaks }