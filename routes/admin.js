const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Formulario")
const  Formulario = mongoose.model("formularios")

//Exibe todos usuarios cadastrados
router.get("/formularios", function (req, res) {
    Formulario.find().sort({date: 'desc'}).then((formularios)=>{
        res.render("admin/formularios", {formularios:formularios})
    }).catch((err)=>{
        req.flash("error_msg", "Houve error ao listar os formulários de membros")
        res.redirect("/admin")
    })
})

//Exibe view para add usuario
router.get("/formularios/add", function (req, res) {
    res.render("admin/addFormulario")
})

//Adiciona novo usuario 
router.post("/formularios/novo", function (req, res) {
    
    //validaçao form
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Digite o seu nome de usuário"})
    }

    if(!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.nome == null){
        erros.push({texto:"Digite o seu sobrenome"})
    }
    //Regex
    var phone = /^(\([0-9]{2}\)\s*|[0-9]{3}\-)[0-9]{4}-[0-9]{5}$/;
    if(!req.body.telefone.match(phone)){
        erros.push({texto:"Digite um telefone válido"})
    }

    if(req.body.descricao == "null" ){
        erros.push({texto: "Selecione uma forma de como nos conheceu."})
    }

    if(erros.length > 0 ){
        res.render("admin/addFormulario", {erros: erros})
    }else{
        const novoFormulario = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            telefone: req.body.telefone,
            descricao: req.body.descricao,
            redeSocial: req.body.redeSocial
        }
    
        new Formulario(novoFormulario).save().then(() =>{
            //Se der certo redireciona
            req.flash("success_msg", "Membro cadastrado com sucesso!")
            res.redirect("/admin/formularios")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar o membro, tente novamente!")
            res.redirect("/admin")
        })
    }  
})

//Encontra o usuario para editar suas informaçoes
router.get("/formularios/edit/:id", function (req, res) {
    Formulario.findOne({_id:req.params.id}).then((formularios) =>{
        res.render("admin/editFormularios",{formularios: formularios})
    }).catch((err)=>{
        req.flash("error_msg", "Esse usuário não está cadastrado!")
        res.redirect("/admin/formularios")
    })
    
})

//Edita a informaçao do usuario
router.post("/formularios/edit", function (req, res) {
    
    //validaçao da ediçao
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Digite o seu nome"})
    }
    if(!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.nome == null){
        erros.push({texto:"Digite o seu sobrenome"})
    }
    //Regex
    var phone = /^(\([0-9]{2}\)\s*|[0-9]{3}\-)[0-9]{4}-[0-9]{5}$/;
    if(!req.body.telefone.match(phone)){
        erros.push({texto:"Digite um telefone válido"})
    }
    if(req.body.descricao == "null" ){
        erros.push({texto: "Selecione uma forma de como nos conheceu."})
    }

    if(erros.length > 0){
        res.render("admin/editFormularios", {erros: erros})
    }else{

        Formulario.findOne({_id: req.body.id}).then((formulario)=>{
            //recebe dados editados
            formulario.nome = req.body.nome
            formulario.sobrenome = req.body.sobrenome
            formulario.telefone = req.body.telefone
            formulario.descricao = req.body.descricao
            formulario.redeSocial = req.body.redeSocial
            
            formulario.save().then(()=>{
                req.flash("success_msg","Informações de usuario editado com sucesso!")
                res.redirect("/admin/formularios")
            }).catch((err)=>{
                req.flash("error_msg", "Houve um erro interno ao editar informaçoes de usuario.")
                res.redirect("/admin/formularios")
            })
        }).catch((err)=>{
            req.flash("error_msg", "Houve um error ao editar usuario")
            res.redirect("/admin/usuarios")
        })

    }

})

router.post("/formularios/deletar", function (req, res) {
    Formulario.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg","Usuário deletado com sucesso!")
        res.redirect("/admin/formularios")
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao deletar Usuario")
        res.redirect("/admin/formularios")
    })
})


//Export routes
module.exports = router