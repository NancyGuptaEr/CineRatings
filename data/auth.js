import { checkNull, checkString, trimString } from "../helper.js"
import bcrypt from 'bcrypt';
import { users } from '../config/mongoCollections.js';
const saltRounds = 10;
export const registerUser = async (
  emailAddress,
  password,
  age,
  role,
  preferGenre,
  preferContent
) => {
  checkNull(emailAddress, 'emailAddress');
  checkNull(password, 'Password');
  checkNull(age, 'Age');
  checkNull(role, 'role');
  checkString(role, 'role');
  if (role === 'user') {
    let preferGenres = ["action", "adventure", "comedy", "drama", "fantasy", "horror", "musicals", "mystery", "romance", "science fiction", "sports", "thriller", "western"];
    checkNull(preferGenre, 'Prefer Genre');
    if (typeof preferGenre !== 'string' && !Array.isArray(preferGenre)) {
      throw `Prefer Genre can be a string value or an array.`;
    }
    if (typeof preferGenre === 'string') {
      checkNull(preferGenre, 'Prefer Genre');
      checkString(preferGenre);
      preferGenre = trimString(preferGenre);
      preferGenre = preferGenre.toLowerCase();
      if (!preferGenres.includes(preferGenre)) {
        throw `Prefer Genre can have action, adventure, comedy, drama, fantasy, horror, musicals, mystery, romance, science fiction, sports, thriller, and western as the value`;
      }
      let temp = preferGenre;
      preferGenre = [];
      preferGenre.push(temp);
    }
    else {
      if (!Array.isArray(preferGenre)) {
        throw `Prefer genre must be an array.`;
      }
      for (let x of preferGenre) {
        checkNull(x, 'genre values');
        checkString(x, 'genre values');
        x = trimString(x);
        x = x.toLowerCase();
        if (!preferGenres.includes(x)) {
          throw `Prefer Genre can have action, adventure, comedy, drama, fantasy, horror, musicals, mystery, romance, science fiction, sports, thriller, and western as the value`;
        }
      }
    }
    checkNull(preferContent, 'Prefer content');
    checkString(preferContent, 'Prefer content');
    preferContent = preferContent.toLowerCase();
    preferContent = trimString(preferContent);
    if (preferContent !== 'g' && preferContent !== 'pg' && preferContent !== 'pg-13' && preferContent !== 'r' && preferContent !== '18+') {
      throw `Prefer Content can either have G, PG, PG-13, R, NC-17 as the value.`;
    }
    //preferContent = preferContent.toUpperCase();
  }
  
  checkString(emailAddress, 'emailAddress');
  checkString(password, 'Password');
  emailAddress = trimString(emailAddress).toLowerCase();
  let match;
  if (emailAddress.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
    match = emailAddress.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
  if (match === null || match !== emailAddress) {
    throw 'email address must be in a valid email format.';
  }
  password = trimString(password);
  if (password.length < 8) {
    throw `Password must be at least 8 characters long.`;
  }
  if (password.match(/[A-Z]/g) === null) {
    throw `Password must contain at least one uppercase character.`;
  }
  if (password.match(/[0-9]/g) === null) {
    throw `Password must contain at least one number.`;
  }
  if (password.match(/[^A-Za-z0-9]/g) === null) {
    throw `Password must contain at least one special character.`;
  }
  if (password.match(/\s/g) !== null) {
    throw `Password cannot contain space.`;
  }
  if (typeof age === 'string') {
    age = trimString(age);
    if (age.length <= 0) {
      throw `Age must have a valid value and cannot contain only spaces.`;
    }
    if (age.match(/[0-9][0-9]*/) === null) {
      throw 'Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.';
    }
    age = parseInt(age);
    if (age < 18 || age > 100) {
      throw `Age must be between 18 and 100.`;
    }
  }
  else {
    age = age.toString();
    age = trimString(age);
    if (age.length <= 0) {
      throw `Age must have a valid value and cannot contain only spaces.`;
    }
    if (age.match(/[0-9][0-9]*/) === null) {
      throw 'Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.';
    }
    age = parseInt(age);
    if (age < 18 || age > 100) {
      throw `Age must be between 18 and 100.`;
    }
  }
  role = role.toLowerCase();
  role = trimString(role);
  if (role !== 'admin' && role !== 'user') {
    throw `Role can either have admin or user as its value.`;
  }
  //preferContent = preferContent.toLowerCase();
  let isAdmin;
  if (role === 'admin')
    isAdmin = true;
  else
    isAdmin = false;
  const passwordHashed = await bcrypt.hash(password, saltRounds);
  const newUser = {
    emailAddress,
    passwordHashed,
    profileImage: "",
    age,
    watchList: {},
    moviesReviewed: [],
    isAdmin,
    preferGenre: preferGenre,
    maxContentRating: preferContent
  }
  const usercollection = await users();
  const exist = await usercollection.findOne({ emailAddress });
  if (exist) {
    throw `Account with the same email address already exists.`;
  }
  const insertInfo = await usercollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add user';
  return { insertedUser: true };
}

export const loginUser = async (emailAddress, password) => {
  checkNull(emailAddress, 'emailAddress');
  checkNull(password, 'password');
  checkString(emailAddress, 'emailAddress');
  checkString(password, 'password');
  emailAddress = trimString(emailAddress);
  password = trimString(password);
  emailAddress = emailAddress.toLowerCase();
  let match;
  if (emailAddress.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
    match = emailAddress.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
  if (match === null || match !== emailAddress) {
    throw 'email address must be in a valid email format.';
  }
  if (password.length < 8) {
    throw `Password must be at least 8 characters long.`;
  }
  if (password.match(/[A-Z]/g) === null) {
    throw `Password must contain at least one uppercase character.`;
  }
  if (password.match(/[0-9]/g) === null) {
    throw `Password must contain at least one number.`;
  }
  if (password.match(/[^A-Za-z0-9]/g) === null) {
    throw `Password must contain at least one special character.`;
  }
  if (password.match(/\s/g) !== null) {
    throw `Password cannot contain space.`;
  }
  const usercollection = await users();
  const exist = await usercollection.findOne({ emailAddress });
  if (!exist) {
    throw `Either the email address or password is invalid.`;
  }
  const isSame = await bcrypt.compare(password, exist.passwordHashed);
  if (!isSame) {
    throw `Either the email address or password is invalid.`;
  }
  return {_id: exist._id, profileImage: exist.profileImage, isAdmin: exist.isAdmin, watchList: exist.watchList, emailAddress: exist.emailAddress };
};