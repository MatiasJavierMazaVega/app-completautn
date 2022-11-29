create database empresautn;

use empresautn;

-- Creamos la tabla Productos para la App completa
create table productos(
idProducto int unsigned not null auto_increment,
nombre varchar(150) not null,
precio int not null,
descripcion varchar(200) not null,
primary key (idProducto) 
);



-- Creamos la tabla Contacto para la App Completa
create table contactos(
idContacto int unsigned not null auto_increment,
nombre varchar(150) not null,
email varchar(150) not null,
primary key (idContacto) 
);

