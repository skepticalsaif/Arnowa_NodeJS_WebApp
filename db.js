const Sequelize = require("sequelize");

// below server is used to deploy the webapp to heroku

// const db = new Sequelize({
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
//   database: "d6icjasd4plnf5",
//   port: "5432",
//   username: "wxufkowzoppawm",
//   password: "139b2b7a840edef16227c5e2992e81963361b941e3148dffe5b7b275c55464fd",
//   host: "ec2-54-243-92-68.compute-1.amazonaws.com",
// });

const db = new Sequelize({
  dialect: "mysql",
  database: "authlocaldb",
  username: "authlocaluser",
  password: "authlocalpass",
});

const Users = db.define("user", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.DataTypes.STRING(30),
    unique: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.DataTypes.STRING(100),
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: Sequelize.DataTypes.STRING,
  },
});

module.exports = {
  db,
  Users,
};
