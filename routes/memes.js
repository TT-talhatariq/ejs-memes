var express = require("express");
var router = express.Router();
const axios = require("axios");
const memesService = require("../memeService");

router.get("/", function (req, res, next) {});

router.get("/overview", async (req, res) => {
  if (!memesService.getMemes()) {
    // Fetch memes only if they haven't been fetched yet
    await memesService.fetchMemes();
  }

  const memes = memesService.getMemes();
  res.render("memes", { memes: memes, user: req.user });
});

router.get("/search", async (req, res) => {
  console.log("here");
  if (!memesService.getMemes()) {
    // Fetch memes only if they haven't been fetched yet
    await memesService.fetchMemes();
  }

  // get query from url
  const query = req.query.query;
  console.log(query);

  const memes = memesService.getMemes();
  // filter memes based on names and query
  const filteredMemes = memes.filter((meme) => {
    return meme.name.toLowerCase().includes(query.toLowerCase());
  });
  if (filteredMemes.length === 0) {
    res.send("No memes found");
  } else {
    res.send(filteredMemes);
  }
});
module.exports = router;
