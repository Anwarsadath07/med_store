const mongoose = require("mongoose")

const medicationSchema = mongoose.Schema({
    medicineName:{
        type: String,
        required: true
    },
    medicinePrice:{
        type: Number,
        required: true
    },
    medicineCategory:{
        type: String,
        required: true,
    },
    medicineAmount:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("medicine", medicationSchema)