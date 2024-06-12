
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const portconnect = 3001;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apptienda',
    port: 3050
  });

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Rutas para el CRUD

// Obtener todos los usuarios
//no probado
app.get('/users', (req, res) => {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                res.status(500).send('Error al obtener usuarios');
                return;
            }
            res.json(results);
        });
    });
  
  // Crear un nuevo usuario
  //incorporado
  app.post('/users', (req, res) => {
    const { name, lastname, username, email, password } = req.body;
    if (!name || !lastname || !username || !email || !password ) {
      res.status(400).send('campos incompletos');
      return;
    }
  
    db.query('INSERT INTO users (Users_name, Users_lastname, Users_username, Users_email, Users_password) VALUES (?, ?, ?, ?, ?)', [name, lastname, username, email, password ], (err, result) => {
      if (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).send('Error al crear usuario');
        return;
      }
      res.status(201).send('Usuario creado exitosamente');
    });
  });
  
    // Crear un nuevo articulo 
    //falta incorporat
    app.post('/articulos', (req, res) => {
        const { name, categoria, codigo, precio, stock, descripcion, imagen } = req.body;
        if (!name || !categoria || !codigo || !precio || !stock || !descripcion || !imagen) {
          res.status(400).send('Por favor proporciona nombre, categoria, precio, stock, descripcion, imagen');
          return;
        }
      
        db.query('INSERT INTO articulo (articulo_name, articulo_idcategoria, articulo_idCodigo, articulo_precio, articulo_stock, articulo_descripcion, articulo_imagen) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, categoria, codigo, precio, stock, descripcion, imagen ], (err, result) => {
          if (err) {
            console.error('Error al crear articulo:', err);
            res.status(500).send('Error al crear articulo');
            return;
          }
          res.status(201).send('Articulo creado exitosamente');
        });
    });

    // Crear una nueva categoria
    //falta incorporar
    app.post('/categoria', (req, res) => {
        const { name, descripcion, estado} = req.body;
        if (!name || !descripcion || !estado) {
            res.status(400).send('Por favor proporcione nombre, descripcion y estado');
            return;
        }

        db.query('INSERT INTO categoria (categoria_name, categoria_descripcion, categoria_estado) VALUES (?, ?, ?)' [name, descripcion, estado], (err, result) => {
            if (err){
                console.error('Error al crear categoria:', err);
                res.status(500).send('Error al crear categoria');
                return;
            }
            res.status(201).send('Categoria creado exitosamente');
        });
    });
      
    // crear detalle de venta
    //falta incorporar
    app.post('/detalle de venta', (req, res) =>{
        const { cantidad, precio, descuento} = req.body;
        if (!cantidad || !precio || !descuento) {
            res.status(400).send('Por favor proporcione cantidad, precio, descuento');
            return;
        }

        db.query('INSERT INTO detalle de venta (detalle_venta_cantidad, detalle_venta_precio, detalle_venta_descuento) VALUES (?, ?, ?)' [cantidad, precio, descuento], (err, result) => {
            if (err){
                console.error('Error al crear detalle de venta:', err);
                res.status(500).send('Error al crear detalle de venta');
                return;
            }
            res.status(201).send('Detalle de venta creador exitosamente');
        });
    });

    // crear rol 
    //no incorporado aun
    app.post('/rol', (req, res) => {
        const { text}= req.body;
        if (!text){
            res.status(400).send('Por favor proporcione el Rol');
            return;
        }

        db.query('INSERT INTO rol (rol_text) VALUES (?)' [text], (err,result)=> {
            if (err){
                console.err('Error al crear Rol:', err);
                res.status(500).send('Error al crear Rol');
                return;
            }
            res.status(201).send('Rol creado exitosamente');
        });
    });
    
  // Actualizar un usuario
  //no incorporado
  app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).send('Por favor proporciona nombre, email y telefono');
      return;
    }
  
    db.query('UPDATE users SET Users_name = ?, Users_email = ?, Users_password = ? WHERE Users_id = ?', [name, email, password, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).send('Error al actualizar usuario');
        return;
      }
      res.send('Usuario actualizado exitosamente');
    });
  });
  
  // Eliminar un usuario
  //incorporado correctamente :)
  app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
  
    db.query('DELETE FROM users WHERE Users_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).send('Error al eliminar usuario');
        return;
      }
      if (result.affectedRows === 1) {
        res.send('Usuario eliminado exitosamente');
      } else {
        res.status(404).send('No se encontró ningún usuario con el ID proporcionado');
      }
    });
  });

  //Inicio de sesion
  //incorporado correctamente :)
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE Users_email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }
  
      if (results.length > 0) {
        const user = results[0];
  
        // Comparar la contraseña ingresada con la contraseña almacenada en la base de datos
        if (password == user.Users_password) {
          res.json({
            user_idrol: user.Users_idrol,
            user_name: user.Users_name,
            user_email: user.Users_email
          });
        } else {
          res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }
      } else {
        res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
      }
    });
  });
  

// Iniciar el servidor
app.listen(portconnect, () => {
  console.log(`Servidor backend corriendo en http://localhost:${portconnect}`);
});