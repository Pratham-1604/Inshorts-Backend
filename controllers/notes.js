const { Note } = require("../models/notes");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(403).json({ status: "API key is missing" });
  }

  try {
    const user = await User.findOne({ where: { apiKey: apiKey } });

    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .json({ status: "Invalid API key or not an admin" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      status: "An error occurred while verifying API key",
      error: err.message,
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { category, title, author, content, link, image, publish_date } =
      req.body;

    const newNote = await Note.create({
      category,
      title,
      author,
      publish_date,
      content,
      link,
      image,
      upvote: 0,
      downvote: 0,
    });

    res.status(200).json({
      status: "Note Created Successfully!",
      short_id: newNote.id,
    });
  } catch (err) {
    res.status(500).json({
      status: "An error occurred! Could not create Note!",
      error: err.message,
    });
  }
};

const getShortsFeed = async (req, res) => {
  try {
    const shorts = await Note.findAll({
      order: [
        ["publish_date", "DESC"],
        ["upvote", "DESC"],
      ],
    });

    res.status(200).json({
      status: "Success",
      data: shorts,
    });
  } catch (err) {
    res.status(500).json({
      status: "Could not fetch shorts feed!",
      error: err.message,
    });
  }
};

const upvoteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Short not found." });
    }

    note.upvote += 1;
    await note.save();

    res.status(200).json({
      status: "Success",
      msg: "Short upvoted successfully.",
      upvotes: note.upvote,
    });
  } catch (err) {
    res.status(500).json({
      status: "Could not upvote short!",
      error: err.message,
    });
  }
};

const removeUpvoteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Short not found." });
    }

    note.upvote -= 1;
    await note.save();

    res.status(200).json({
      status: "Success",
      msg: "Short upvote removed successfully.",
      upvotes: note.upvote,
    });
  } catch (err) {
    res.status(500).json({
      status: "Could not remove upvote of short!",
      error: err.message,
    });
  }
};

const downvoteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Short not found." });
    }

    note.downvote += 1;
    await note.save();

    res.status(200).json({
      status: "Success",
      msg: "Note downvoted successfully.",
      downvotes: note.downvote,
    });
  } catch (err) {
    res.status(500).json({
      status: "Could not downvote short!",
      error: err.message,
    });
  }
};
const removeDownvoteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findByPk(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Note not found." });
    }

    note.downvote -= 1;
    await note.save();

    res.status(200).json({
      status: "Success",
      msg: "Note downvote removed successfully.",
      downvotes: note.downvote,
    });
  } catch (err) {
    res.status(500).json({
      status: "Could not remove downvote of short!",
      error: err.message,
    });
  }
};

const getFilteredShorts = async (req, res) => {
  try {
    const { filter, search } = req.query;

    const filters = {};
    const searchConditions = [];
    const searchResults = {
      contains_title: false,
      contains_content: false,
      contains_author: false,
    };

    let searchParams = {};

    if (filter) {
      const filterParams = JSON.parse(filter);
      if (filterParams.category) {
        filters.category = filterParams.category;
      }
      if (filterParams.publish_date) {
        filters.createdAt = { [Op.gte]: new Date(filterParams.publish_date) };
      }
      if (filterParams.upvote) {
        filters.upvote = { [Op.gt]: parseInt(filterParams.upvote, 10) };
      }
    }

    if (search) {
      searchParams = JSON.parse(search);
      if (searchParams.title) {
        searchConditions.push({
          title: { [Op.like]: `%${searchParams.title}%` },
        });
        searchResults.contains_title = true;
      }
      if (searchParams.keyword) {
        searchConditions.push({
          [Op.or]: [
            { title: { [Op.like]: `%${searchParams.keyword}%` } },
            { content: { [Op.like]: `%${searchParams.keyword}%` } },
          ],
        });
        searchResults.contains_content = true;
      }
      if (searchParams.author) {
        searchConditions.push({
          author: { [Op.like]: `%${searchParams.author}%` },
        });
        searchResults.contains_author = true;
      }
    }

    const notes = await Note.findAll({
      where: {
        ...filters,
        [Op.and]: searchConditions,
      },
      order: [
        ["createdAt", "DESC"],
        ["upvote", "DESC"],
      ],
    });

    const formattedNotes = notes.map((note) => ({
      short_id: note.id,
      category: note.category,
      title: note.title,
      author: note.author,
      publish_date: note.createdAt,
      content: note.content,
      actual_content_link: note.link,
      image: note.image,
      votes: {
        upvote: note.upvote,
        downvote: note.downvote,
      },
      contains_title: searchParams.title
        ? note.title.includes(searchParams.title)
        : false,
      contains_content: searchParams.keyword
        ? note.content.includes(searchParams.keyword)
        : false,
      contains_author: searchParams.author
        ? note.author.includes(searchParams.author)
        : false,
    }));

    res.status(200).json({
      status: "Success",
      data: formattedNotes,
    });
  } catch (err) {
    res.status(500).json({
      status: "Could not fetch filtered feed!",
      error: err.message,
    });
  }
};

module.exports = {
  verifyApiKey,
  addNote,
  getShortsFeed,
  upvoteNote,
  removeUpvoteNote,
  downvoteNote,
  removeDownvoteNote,
  getFilteredShorts,
};
