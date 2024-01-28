var express = require("express");
var router = express.Router();
const axios = require("axios");
const memesService = require("../memeService");

router.get("/", function (req, res, next) {});

router.get("/meme/:id", async (req, res) => {
  // Fetch meme from API
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  const id = req.params.id;
  console.log(id);

  if (!memesService.getMemes()) {
    await memesService.fetchMemes();
  }

  const meme = memesService.getMemeById(id);
  console.log(meme);

  res.render("meme", { meme, user: req.user });
});

module.exports = router;
