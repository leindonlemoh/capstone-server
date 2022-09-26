const mysql = require("mysql2");
const bycrypt = require("bcrypt");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const hasEmptyFields = (body, error_list) => {
  for (field in body) {
    if (!body[field]) {
      error_list[field] = `${field} is required.`;
    }
  }
  if (Object.keys(error_list).length > 0) {
    return true;
  }
  return false;
};

// register, confirmpassword, email duplicate
exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    user_address,
    contact_number,
    password,
    confirm_password,
  } = req.body;
  let error_list = {};
  // error_list.first_name = first_name ? "" : "First Name is required";

  if (hasEmptyFields(req.body, error_list)) {
    res.status(400);
    return res.json(error_list);
  }

  if (password !== confirm_password) {
    error_list.confirm_password = "Password does not match";
    return res.status(400).json(error_list);
  }

  const hashpassword = await bycrypt.hash(password, 10);

  db.query(`SELECT * FROM user WHERE email = ?`, email, (err, result) => {
    if (err) {
      console.log(err.message);
      res.send(err);
    }

    if (result.length > 0) {
      error_list.email = "Email is already in use.";
      return res.status(400).json(error_list);
    }
    db.query(
      `INSERT INTO user SET?`,
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        user_address: user_address,
        contact_number: contact_number,
        password: hashpassword,
      },
      (err) => {
        if (err) {
          return console.log(err.message);
        }
        console.log("Registration successful");
        res.send("success");
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    `SELECT * FROM user
    WHERE email = ?`,
    email,
    async (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (
        !result.length ||
        !(await bycrypt.compare(password, result[0].password))
      ) {
        console.log(result);
        return res
          .status(401)
          .json({ message: "Email or password is incorrect" });
      }
      return res.status(200).json(result[0]);
    }
  );
};

exports.addproducts = (req, res) => {
  const {
    product_name,
    product_price,
    product_image,
    category_id,
    product_description,
  } = req.body;

  db.query(
    ` INSERT INTO products SET ?`,
    {
      product_name: product_name,
      product_price: product_price,
      product_image: product_image,
      category_id: category_id,
      product_description: product_description,
    },
    (err) => {
      if (err) {
        return console.log(err.message);
      }
      console.log("new product added");
      res.send("addes");
    }
  );
};
