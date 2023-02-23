import {Sequelize, Model, DataTypes} from "sequelize";

const sequelize = new Sequelize("sqlite:testdb.db");
const User = sequelize.define("User", {
	username: DataTypes.STRING,
	birthday: DataTypes.DATE
});
/*
const jane = await User.create({
  username: 'bendover',
  birthday: new Date(1980, 6, 4),
});

const users = await User.findAll();
console.log(users);
*/
export {User}
