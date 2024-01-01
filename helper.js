import { ObjectId } from "mongodb";

export const checkNull = (value, name) => {
    if(!value){
        throw `${name} must have a valid value.`;
    }
}
export const checkString = (value, name) => {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw `${name} must be a string and it cannot be containing only spaces.`;
        }
}
export const trimString = (arg) => {
    if (typeof arg === 'string') {
        return arg.trim();
    }
    return arg;
}

export const checkStr = (param, paramName) => {
    if (!param) throw `${paramName} must be exist!`;
    if (typeof param !== "string")
      throw `the type of ${paramName} must be string!`;
    param = param.trim();
    if (param.length === 0)
      throw `${paramName} cannot consist of spaces entirely!`;
    return param;
  };
  export const checkDate = (date, whatDate) => {
    date = checkStr(date, whatDate);
    if (
      !date.match(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/[12][0-9]{3}$/gim)
    )
      throw `${whatDate} type is invalid`;
    const [month, day, year] = date.split("/");
    const formatDate = new Date(year, month - 1, day);
    if (
      !(
        formatDate.getFullYear() === +year &&
        formatDate.getMonth() + 1 === +month &&
        formatDate.getDate() === +day
      )
    )
      throw `${whatDate} is invalid`;
    return date;
  };
  export const checkName = (param, paramName) => {
    param = checkStr(param, paramName);
    if (!param.match(/^[a-z]{0,25}( [a-z]{0,25}){1,2}$/gi))
      throw `${paramName} must consist of letters and 2-3 spaces`;
    return param;
  };

  export const checkId = (movieId)  =>  {
    if(!movieId)  {
      throw 'movie Id is incorrect';
    }
    if(typeof movieId !== 'string')  {
      throw 'movie id is not of proper type';
    }
    movieId = movieId.trim();
    if(movieId.length === 0)  {
      throw 'movie id cannot be empty spaces';
    }
    if(!ObjectId.isValid(movieId))  {
      throw 'movie id is not of proper type';
    }
    return movieId;
  }
  
export const checkReview = (review) =>  {
  if(!review) {
    throw 'review is not there';
  }
  if(typeof review !== 'string')  {
    throw 'review is not of proper type';
  }
  review = review.trim();
  if(review.length === 0) {
    throw 'review cannot be just empty spaces';
  }
  const regex = /^[a-zA-Z0-9\s,:;'"/!@()\[\]\-*$%&#^+=.]+$/;
  if(!regex.test(review)) {
    throw 'Review contains invalid characters';
  }
  return review;
}

export const isValidRating = (rating)  =>  {
  if(!rating) {
    throw 'rating is incorrect';
  }
  rating = Number(rating);
  if(typeof rating !== 'number')  {
    throw 'rating should be between 1-5 only';
  }
  if(rating === undefined || rating === null) {
    throw 'please provide the ratings';
  }
  if(rating <= 0 || rating > 5)   {
    throw 'ratings can be between 1 and 5 only';
  }
  if(!Number.isInteger(rating))   {
    throw 'rating should be a whole number only';
  }
  return rating;
}

export const isValidEmail = (emailId) =>  {
  if(!emailId)    {
    throw 'Either the email address or password is invalid';
  }
  if(typeof emailId !== 'string') {
    throw 'Either the email address or password is invalid';
  }
  //check emailAddress should be a valid email address format
  //it should also be case insensitive
  emailId = emailId.trim();
  if(emailId.length === 0)    {
    throw 'Either the email address or password is invalid';
  }
  emailId = emailId.toLowerCase();
  emailId = emailId.replace(/\s+/g, '');

  //check if email id contains @
  if(!emailId.includes('@'))  {
    throw 'Either the email address or password is invalid';
  }

  //split the email id into prefix and suffix
  const [prefix, suffix] = emailId.split('@');
  const suffixExtra = suffix.split('.');
  //console.log(suffixExtra);

  //check if we have 2 dot's in suffix
  if(suffixExtra.length > 2) {
    throw 'Either the email address or password is invalid';
  }

  //valid prefix format
  const validPrefix = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*$/;
  let boolPrefix = validPrefix.test(prefix);

  //valid domain format
  const validSuffix = /^[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  let boolSuffix = validSuffix.test(suffix);

  if(boolPrefix === false || boolSuffix === false)    {
    throw 'Either the email address or password is invalid';
  }

  return emailId;
}