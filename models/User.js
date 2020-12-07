const { Schema, model, SchemaTypes} = require("mongoose");

const User = new Schema({
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },
    diskSpace: {
        type: SchemaTypes.Number,
        required: true,
        default: 1024 ** 3 * 5
    },
    usedSpace: {
        type: SchemaTypes.Number,
        required: true,
        default: 0
    },
    avatar: {
        type: SchemaTypes.String,
    },
    files: [{
        type: SchemaTypes.ObjectId,
        ref: "File"
    }]
});

module.exports = model("User", User);