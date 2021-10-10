const yup = require('yup');

// regexp
const nicknameRegex = /^[a-z0-9_]{3,16}$/i;
const emailRegex = /^\S+@\S+\.\S+$/;
const discordRegex = /^.{2,32}#\d{4}$/;
const tokenRegex = /^\$2[a-z0-9.\/$]{58}$/i;
const ipRegex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
const skinFilenameRegex = /^[a-z0-9_\-\/]{3,16}.png$/i;

// schemes
const nicknameScheme = yup.string().matches(nicknameRegex);
const emailScheme = yup.string().matches(emailRegex);
const discordScheme = yup.string().matches(discordRegex);
const tokenScheme = yup.string().matches(tokenRegex);
const ipScheme = yup.string().matches(ipRegex);
const skinFilenameScheme = yup.string().matches(skinFilenameRegex);

module.exports = {
  regex: {
    nicknameRegex,
    emailRegex,
    discordRegex,
    tokenRegex,
    ipRegex,
    skinFilenameRegex,
  },
  schemes: {
    nicknameScheme,
    emailScheme,
    discordScheme,
    tokenScheme,
    ipScheme,
    skinFilenameScheme,
  },
};
