const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Formulario = new Schema({
    nome:{
        type: String,
        required: true
    },
    sobrenome:{
        type: String,
        required: true
    },
    telefone:{
        type: String,
        required: true
    },
    descricao:{
        type:String,
        required: true
    },
    redeSocial:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("formularios", Formulario)