const { ObjectId, Schema, model, SchemaTypes } = require("mongoose");

const File = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    type: {
        type: SchemaTypes.String,
        required: true,
    },
    date: {
        type: SchemaTypes.Date,
        default: Date.now(),
    },
    accessLink: {
        type: SchemaTypes.String,
    },
    size: {
        type: SchemaTypes.Number,
        default: 0,
    },
    path: {
        type: SchemaTypes.String,
        default: "",
    },
    user: {
        type: ObjectId,
        ref: "User"
    },
    parent: {
        type: ObjectId,
        ref: "File"
    },
    childs: [{
        type: ObjectId,
        ref: "File"
    }]

});

module.exports = model("File", File);