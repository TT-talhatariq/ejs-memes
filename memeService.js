const axios = require("axios");

let memes = [];

const fetchMemes = async () => {
  try {
    const response = await axios.get("http://jss.restapi.co.za/memes");
    memes = response.data.memes;
  } catch (err) {
    console.log("Error Fetching", err);
  }
};

const getMemes = () => {
  if (memes.length === 0) return false;

  return memes;
};

const getMemeById = (id) => {
  if (memes.length === 0) return false;

  console.log(memes);
  for (let i = 0; i < memes.length; i++) {
    console.log(memes[i].id, id);
    if (String(memes[i].id) === String(id)) {
      console.log("Matched", memes[i].id, id);
      return memes[i];
    }
  }

  return false;
};

module.exports = { fetchMemes, getMemes, getMemeById };
