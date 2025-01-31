import {express, mongoose} from '../index.js';
import { Publish } from '../Interfaces/publish.js';
import { User } from '../Interfaces/user.js';


//Modulo que permite el envio de correos a gmail
let { google } = require('googleapis')
let nodemailer = require("nodemailer");

let REFRESH_TOKEN = "1//04OY1_12rLq02CgYIARAAGAQSNwF-L9IrfTgit-rx0rwo_FINCuFE3CYr_t-0okHvq_0sZWHjdqycRx7WSFLWcz193MHLuqSpzFU";
let CLIENT_ID = "90357140452-qdmaul0i29hco6122uhqs7oielejdcmm.apps.googleusercontent.com";
let CLIENT_SECRET = "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";
let userMail = "testsubaster@gmail.com";
let REDIRECT_URI ="https://developers.google.com/oauthplayground"; // NO CAMBIAR
let oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI); // NO CAMBIAR
oAuth2Client.setCredentials({ refresh_token:REFRESH_TOKEN }); // NO CAMBIAR




const compraC = express.Router();
let compraS = require("../models/compraS");
let stockS = require("../models/stockS")
let publicationS = require("../models/publicationS");
let ObjectID = require('mongodb').ObjectID;

compraC.post('/buy', async (req:any,res:any) => {
    
    let user:User = req.body.user
    let publicacion:Array<Publish> = req.body.productos
    let idinactive = req.body.inactivo
    let idactive = req.body.activo
    let cantidad = req.body.cantidad
    let mail={
        from: "Subaster",
        to: user.correo,
        subject: "Subaster - Recibo de Compra",
        html: ""
    }
    console.log(idactive);

    await saveBuy(user.id, publicacion, cantidad, idinactive, idactive).then((data:any) =>{
        mail.html = data;
    })
    for(let i in publicacion){
        console.log("Actualizando cantidad de las publicaciones");
        await updateQuantity(publicacion[i].id,(publicacion[i].cantidad as number - cantidad[i]));
    }
    try {
        let accessToken = await oAuth2Client.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                type:"OAuth2",
                user: userMail,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        await transporter.sendMail(mail);
        console.log("Email enviado correctamente a : " + userMail);
        res.send(JSON.stringify({status:"ok"}));
    } catch (err){
        console.log(err);
        res.status(200).send("enviado");
    }
    
})

async function saveBuy(idusuario:any, publicaciones:Array<Publish>, cantidades:any, inactivo:any,idactivo:any){
    let total = 0;
    let html ='<div style="text-align: center;">'+
                        '<h1>Subaster</h1>'+
                        '<h4 style="margin-top: 20px">¡Hola! Gracias por comprar con nosotros.</h4>'+
                        '<h5>Te adjuntamos el recibo de tu compra:</h5>'
    for(let i in publicaciones){
        html = html + '<h5>Código: ' + publicaciones[i].id + '</h5>'
        html = html + '<h5>Artículo: '+ publicaciones[i].nombre +'</h5>'
        html = html + '<h5>Valor: CLP$' + publicaciones[i].precio + '</h5>'
        html = html + '<h5>Cantidad: ' + cantidades[i] + '</h5>'
        total = total + (publicaciones[i].precio as number) * cantidades[i]
        for (let index = 0; index < cantidades[i]; index++) {
            stockS.
            findOneAndUpdate({"idpublicacion": ObjectID(publicaciones[i].id), "idestado":ObjectID(idactivo)}, {$set: {"idestado": ObjectID(inactivo)}}, async (err:any, data:any ) =>{   
                let compra = new compraS({
                    idstock: data._id ,
                    idusuario:idusuario,
                    idpublicacion:publicaciones[i].id,
                    fechaventa:new Date()
                })
                compra
                .save(async (err:any, data:any) =>{
                    if(data){
                        console.log("venta fija update");
                    }
                    else{
                        console.log(err);   
                    }
                })
            })
        }
    }    
    html = html + '<h5>Total: CLP$' + total + '</h5>'
    html = html + '</div>'  
    console.log(html);
       
    return html
}

async function updateQuantity(idpublicacion:any, cantidadA:any) {
    publicationS
    .findOneAndUpdate({_id: idpublicacion}, {$set: {cantidad: cantidadA}}, (err:any, data:any) =>{
        if(err){
            console.log("Error encontrado al añadir iddireccion en publicacion");
            console.log(err);
            return JSON.stringify({status:"invalid"})
        }
       return JSON.stringify({status:"ok"})
    })
}

module.exports = compraC;