const jwtMWChecker = require("../middleware/jwtMWChecker"); 
const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.get("/", jwtMWChecker /* Using the express jwt MW here */, (req, res) => {
    const contacts = db.get("contacts").value();
    res.json({
        sucess: true,
        err: null,
        contacts
    });
    console.log("Web Token Checked, sending contacts json");
});
      
module.exports = router;
