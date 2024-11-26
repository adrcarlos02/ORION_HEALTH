import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, defaultValue: "000000000" },
  gender: { type: DataTypes.STRING, defaultValue: "Not Selected" },
  dob: { type: DataTypes.STRING, defaultValue: "Not Selected" },
  address: { type: DataTypes.JSON, defaultValue: { line1: "", line2: "" } },
  image: { type: DataTypes.STRING, defaultValue: "default_image_url" },
});

export default User;
