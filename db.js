const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  database: "",
  port: "",
  username: "",
  password: "",
  host: "",
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
