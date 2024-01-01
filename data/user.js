import { checkId, checkNull, checkString, trimString } from "../helper.js"
import bcrypt from 'bcrypt';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from "mongodb";
const saltRounds = 10;
//Place user data functions here
export const getUser = async (userid) => {
  checkNull(userid)
  checkId(userid);
  checkString(userid);
  const usercollection = await users();
  const exist = await usercollection.findOne({ _id: new ObjectId(userid) });
  if (!exist) {
    throw `User with that id does not exist.`;
  }
  return exist;
}
export const updateUser = async (
  userid,
  profileImage,
  emailAddress,
  age,
  role,
  preferGenre,
  preferContent) => {
  checkNull(userid);
  checkString(userid);
  checkId(userid);
  checkNull(emailAddress, 'emailAddress');
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
    checkNull(preferContent, 'Prefer Content');
    checkString(preferContent, 'prefer content');
    preferContent = preferContent.toLowerCase();
    preferContent = trimString(preferContent);
    if (preferContent !== 'g' && preferContent !== 'pg' && preferContent !== 'pg-13' && preferContent !== 'r' && preferContent !== '18+') {
      throw `Prefer Content can either have G, PG, PG-13, R, NC-17 as the value.`;
    }
  }
  checkString(emailAddress, 'emailAddress');
  emailAddress = trimString(emailAddress).toLowerCase();
  let match;
  if (emailAddress.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
    match = emailAddress.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
  if (match === null || match !== emailAddress) {
    throw 'email address must be in a valid email format.';
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
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(userid) });
  let maxContentRating = preferContent;
  if (!user) throw "User with given id does not exist";
  if (profileImage !== "") {
    const updateInfo = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userid),
      },
      { $set: { profileImage, preferGenre, maxContentRating } },
      { returnDocument: "after" }
    );
    if (!updateInfo) throw "update failed";
    return updateInfo;
  }
  else {
    const updateInfo = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userid),
      },
      { $set: { preferGenre, maxContentRating } },
      { returnDocument: "after" }
    );
    if (!updateInfo) throw "update failed";
    return updateInfo;
  }
}