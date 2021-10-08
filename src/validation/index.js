import yup from 'yup';

// regexp
const usernameRegex = /^[a-z0-9_]{3,16}$/i;
const emailRegex = /^\S+@\S+\.\S+$/;
const discordRegex = /^.{2,32}#\d{4}$/;
const tokenRegex = /^\$2[a-z0-9.\/$]{58}$/i;
const ipRegex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
const skinFilenameRegex = /^[a-z0-9_\-\/]{3,16}.png$/i;

// schemes
const usernameScheme = yup.string().matches(usernameRegex);
const emailScheme = yup.string().matches(emailRegex);
const discordScheme = yup.string().matches(discordRegex);
const tokenScheme = yup.string().matches(tokenRegex);
const ipScheme = yup.string().matches(ipRegex);
const skinFilenameScheme = yup.string().matches(skinFilenameRegex);

export default {
  regex: {
    usernameRegex,
    emailRegex,
    discordRegex,
    tokenRegex,
    ipRegex,
    skinFilenameRegex,
  },
  schemes: {
    usernameScheme,
    emailScheme,
    discordScheme,
    tokenScheme,
    ipScheme,
    skinFilenameScheme,
  },
};
