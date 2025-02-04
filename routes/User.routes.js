const express = require('express')
const { register, login, setAvatar, getAllUsers, logOut } = require('../controllers/User.controllers')
const router = express.Router()


router.post('/register',register)
router.post('/login',login)
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);



module.exports = router