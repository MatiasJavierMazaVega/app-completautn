const express = require('express');
const app = express();
const mysql = require('mysql2');
//motor de plantilla
const hbs = require('hbs');
//encontrar archivos
const path = require('path');
//para enviar mails
const nodemailer = require('nodemailer');
//variable de entorno
require ('dotenv').config();

//Configuramos el puerto
const PORT = process.env.PORT || 9000;

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//configuramos el motor de plantillas de HBS
app.set('view engine', 'hbs');
//configuramos la ubicacion de las plantillas
app.set('views', path.join(__dirname, 'views'));
//configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'));

//conexion a la base de datos
/*const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT
})*/

/*conexion.connect((err) =>{
    if(err) throw err;
    console.log(`Conectado a la Database ${process.env.DATABASE}`)
})*/

//rutas de la aplicacion
app.get('/', (req, res) =>{
    res.render('index',  {
        titulo: 'Título'
    })
})

app.get('/formulario', (req, res) =>{
    res.render('formulario')
})


app.get('/productos', (req, res) =>{

    let sql = "SELECT * FROM productos";
    conexion.query(sql, function(err, result){
            if (err) throw err;
                console.log(result);
                res.render('productos',  {
                    titulo: 'Productos',
                    datos: result
                })
        })
})

app.get('/contacto', (req, res) =>{
    res.render('contacto',  {
        titulo: 'Contacto'
    })
})

app.post('/formulario', (req, res) =>{
   console.log(req);
   
   const nombre = req.body.nombre;
   const precio = req.body.precio;
   const descripcion = req.body.descripcion;
   
   let datos = {
    nombre: nombre,
    precio: precio,
    descripcion: descripcion
   }

   let sql = "INSERT INTO productos set ?";
        conexion.query(sql, datos, function(err){
            if (err) throw err;
                console.log(`1 Registro insertado`);
                res.render('enviado')
        }) 

        
   //res.send(`Sus datos han sido recibidos: ${nombre} - ${precio} - ${descripcion}`)
})

app.post('/contacto', (req, res) =>{
    console.log(req);
    
    const nombre = req.body.nombre;
    const email = req.body.email;
    
    //creamos una funcion para enviar mail al cliente
    async function envioMail(){
        //configuramos la cuenta del envio
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            }
        });
        //envio mail
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: `${email}`,
            subject: "Gracias por suscribirte a nuestra App",
            html:`Muchas gracias por visitar nuestra página <br>
            Recibiras nuestras promociones a esta dirección de correo. <br>
            Buen fin de semana!!`
        })
    }
    
    let datos = {
     nombre: nombre,
     email: email,
     
    }
 
    let sql = "INSERT INTO contactos set ?";
         conexion.query(sql, datos, function(err){
             if (err) throw err;
                 console.log(`1 Registro insertado`);
                 envioMail().catch(console.error);
                 res.render('enviado')
         }) 
 
         
 })

//servidor a la escucha de las peticiones
app.listen(PORT, () =>{
    console.log(`Servidor trabajando en el Puerto ${PORT}`)
});

console.log();