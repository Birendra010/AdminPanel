const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const user = async (req, res) => {
  try {
    let { name, email, password,isAdmin} = req.body;
    if (!name) return res.status(400).send({ message: " name is required" });
    if (!email) return res.status(400).send({ message: " email is required" });
    if (!password)
      return res.status(400).send({ message: " password is required" });

    let existEmail = await userModel.findOne({ email: email });
    if (existEmail) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "User with this email is already registered",
        });
    }

    let hash= await bcrypt.hash(req.body.password, 10)
    const user = new userModel({
      email: email,
      password: hash,
      isAdmin:isAdmin,
      name:name
    })
    let savedData = await userModel.create(user);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


////login user
const loginUser = async function (req, res) {
  try {
    const email = req.body.email;
    const Password = req.body.password;

    if (!email) {
      return res.status(400).send({ msg: "email is not present" });
    }
    if (!Password) {
      return res.status(400).send({ msg: "Password is not present" });
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, msg: "email or Password is not corerct" });
    }

    let hashPassword= await bcrypt.compare(Password,user.password)
if(!hashPassword){
  return res.status(404).send({ msg: "UserName or Password is not corerct" });
}
let admin = user.isAdmin
if(admin === false){
  return res.status(401).send({msg:"Unauthorized user"})
}
    let token = await jwt.sign({ userId: user._id }, "my-self-key");
    return res.header("x-api-key",token).status(200).send({ status: true});
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};





///**************delete Api************** */
const deleteUser = async function (req, res) {

  try {
    // let userId = req.params.userId
    let id = req.body.userId
    let userdata = await userModel.findById(id)
    if (!userdata) {
      return res.status(404).send({ msg: "No user exists with this uaerId" })
    }
    if (userdata.isAdmin === true) {
      return res.status(401).send({ msg: "Unauthorized access" })
    }
    let deleteUser = await userModel.findByIdAndDelete(id)
    return res.status(200).send({ status: true, msg: "user is sucessfully deleted" })
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



module.exports = { user, loginUser,deleteUser };
