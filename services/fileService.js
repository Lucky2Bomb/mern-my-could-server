const fs = require("fs");
const File = require("../models/File");
// const config = require("config");

class FileService {

    createDir(req, file) {
        // const filePath = `${config.get("filePath")}\\${file.user}\\${file.path}`;
        const filePath = this.getPath(req, file);
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(file)) {
                    fs.mkdirSync(filePath);
                    return resolve({ message: "File was created" });
                } else {
                    return resolve({ message: "File already exist" });
                }
            } catch (error) {
                console.log(error);
                reject({ message: "File error" });
            }
        }));
    }

    deleteFile(req, file) {
        const path = this.getPath(req, file);
        if (file.type === "dir") {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }

    getPath(req, file) {
        return `${req.filepath}\\${file.user}\\${file.path}`;
    }
}

module.exports = new FileService();