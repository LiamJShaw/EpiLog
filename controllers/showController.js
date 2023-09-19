const Show = require("../models/show");
const Actor = require("../models/actor");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of shows and actors
    const [
        numShows,
        numActors,
    ] = await Promise.all([
        Show.countDocuments({}).exec(),
        Actor.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "MyTVList",
        show_count: numShows,
        actor_count: numActors,
    })
});

exports.show_list = asyncHandler(async (req, res, next) => {
    const allShows = await Show.find({}, "name")
      .sort({ name: 1 })
      .populate("actor")
      .exec();
  
    res.render("show_list", { title: "Show List", show_list: allShows });
  });
  
  exports.show_detail = asyncHandler(async (req, res, next) => {
    const show = await Show.findById(req.params.id).exec();

    if (show === null) {
        // No results.
        const err = new Error("Show not found");
        err.status = 404;
        return next(err);
    }
    
    res.render("show_detail", {
        title: show.name,
        name: show.name,
        description: show.description,
        episode_count: show.episode_count,
        episode_length: show.episode_length  
    });
});
