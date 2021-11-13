const userModel = require("./users");

const { db } = require("../../models/index");

const { DataTypes } = require("sequelize");


module.exports = { users: userModel(db, DataTypes) };
