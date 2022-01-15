const yup = require('yup');

// regexp
const nicknameRegex = /^[a-z0-9_]{3,16}$/i;
const emailRegex = /^\S{1,64}@\S{1,64}\.\S{1,64}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-zа-яё\W])([^\s]){8,32}$/i;
const discordRegex = /^.{2,32}#\d{4}$/;
const tokenRegex = /^\$2[a-z0-9.\/$]{58}$/i;
const ipRegex = /^::(1|ffff:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})?$/;
const skinFilenameRegex = /^[a-z0-9_\-]{3,16}.png$/i;

// schemes
const nicknameScheme = yup.string().matches(nicknameRegex);
const emailScheme = yup.string().matches(emailRegex);
const discordScheme = yup.string().matches(discordRegex);
const tokenScheme = yup.string().matches(tokenRegex);
const ipScheme = yup.string().matches(ipRegex);
const skinFilenameScheme = yup.string().matches(skinFilenameRegex);
const passwordScheme = yup.string().matches(passwordRegex);

const registrationScheme = yup
  .object()
  .required()
  .shape({
    nickname: nicknameScheme.required(),
    email: emailScheme.required(),
  });

const loginScheme = yup.object().shape({
  nickname: nicknameScheme.required(),
  password: passwordScheme.required(),
});

module.exports = {
  regex: {
    nicknameRegex,
    emailRegex,
    passwordRegex,
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
    registrationScheme,
    loginScheme,
  },
};
