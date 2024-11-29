const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send("Credenciais inválidas.");
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect("/"); // Ou retorne o token para o frontend
  } catch (err) {
    res.status(400).send("Erro ao realizar login.");
  }
});

// Registrar usuário (somente admins)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    res.status(400).send("Erro ao registrar usuário.");
  }
});

module.exports = router;
