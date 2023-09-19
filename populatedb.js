#! /usr/bin/env node

console.log("This script populates a provided database with TV shows and Actors");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Show = require("./models/show");
const Actor = require("./models/actor");

const shows = [];
const actors = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    
    await createActors();
    await createShows();
    
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
async function showCreate(index, name, description, episode_count, episode_length, actor) {
    const showdetail = {
      name: name,
      description: description,
      episode_count: episode_count,
      episode_length: episode_length,
      actor: actor,
    };
    if (actor) showdetail.actor = actor;
  
    const show = new Show(showdetail);
    await show.save();
    shows[index] = show;
    console.log(`Added show: ${name}`);
  }
  
  async function actorCreate(index, first_name, family_name) {
    const actordetail = { first_name: first_name, family_name: family_name };
  
    const actor = new Actor(actordetail);
  
    await actor.save();
    actors[index] = actor;
    console.log(`Added actor: ${first_name} ${family_name}`);
  }

  async function createActors() {
    console.log("Adding actors...");
    await Promise.all([
        actorCreate(0, "Patrick", "Adams"),
        actorCreate(1, "Sarah", "Rafferty"),
        actorCreate(2, "Monkey D.", "Luffy")
    ]);
  }

  async function createShows() {
    console.log("Adding shows...");
    await Promise.all([
        showCreate(0, "Suits", "Suits description", 100, 45, [actors[0], actors[1]]),
        showCreate(1, "One Piece", "One Piece description", 1050, 22, [actors[2]]),
    ]);
  }
  