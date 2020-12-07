const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require("config");
const { check, validationResult } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const fileService = require("../services/fileService");
const File = require("../models/File");
const { secretKey } = require("../config");

router.post("/registration",
    [
        check("email", "Uncorrect email").isEmail(),
        check("password", "Password length must be no shorter than 5 and no longer than 20")
            .isLength({
                min: 5,
                max: 20
            }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Uncorrect request", errors });
            }

            const { email, password } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: `Email ${email} already exist` });
            }
            const hashPassword = await bcrypt.hash(password, 6);
            const user = new User({ email, password: hashPassword });
            await user.save();

            await fileService.createDir(req, new File({ user: user.id, name: "" }));

            return res.json({ message: "User was created" });
        } catch (e) {
            console.log(e);
            res.send({ message: "server error" });
        }
    });

router.post("/login",
    async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPassportValid = bcrypt.compareSync(password, user.password);
            if (!isPassportValid) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "2h" });
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e);
            res.send({ message: "server error" });
        }
    });

router.get("/auth", authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user.id });

            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "2h" });
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e);
            res.send({ message: "server error" });
        }
    });

module.exports = router;