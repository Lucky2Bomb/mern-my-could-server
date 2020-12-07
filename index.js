const express = require("express");
const mongoose = require("mongoose");
// const config = require("config");
const fileUpload = require("express-fileupload"); 
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const corsMiddleware = require("./middleware/cors.middleware");
const filepathMiddleware = require("./middleware/filepath.middleware");
const path = require("path");
const { serverPort, dbURL } = require("./config");
const app = express();


const PORT = process.env.PORT || serverPort;
// const PORT = config.get("serverPort");

app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(filepathMiddleware(path.resolve(__dirname, "Files")));
app.use(express.json());
app.use(express.static("static"));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

const start = async () => {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}...`);
        });
    } catch (e) {
        
    }
}

start();