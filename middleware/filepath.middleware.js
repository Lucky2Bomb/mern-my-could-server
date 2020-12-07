function filepath(path) {
    return function (req, res, next) {
        req.filepath = path;
        next();
    }
}

module.exports = filepath;