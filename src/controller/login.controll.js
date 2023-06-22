const User = require('../db/models/User');
const admin = require('firebase-admin');

async function saveUserDataInDatabase(userData) {
    // Lógica para guardar los datos del usuario en la base de datos
    // Por ejemplo, utilizando Firestore o cualquier otra base de datos
  
    // Ejemplo con Firestore
    const firestore = admin.firestore();
    const userRef = firestore.collection('users').doc(userData.uid);
    await userRef.set(userData);
  }

const login = async (req, res) => {
    const { idToken } = req.body;
  
    try {
      // Verificar el token de Firebase para obtener el UID del usuario
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
  
      // Aquí puedes agregar la lógica adicional que necesites para el inicio de sesión con Google
      // Puedes validar el UID en tu base de datos, guardar información adicional, etc.
  
      // Por ejemplo, guardar la información del usuario en la base de datos
    //   const userData = {
    //     email: req.body.email,
    //     name: req.body.name,
    //     image: req.body.image,
    //     phone: req.body.phone,
    //     uid: uid
    //   };
  
    const [user, created] = await User.findOrCreate({
        where: { uid },
        defaults: {
          email: req.body.email,
          name: req.body.name,
          image: req.body.image,
          phone: req.body.phone
        }
      });
  
      if (created) {
        console.log('Usuario creado:', user);
      } else {
        console.log('Usuario existente:', user);
      }

      // Lógica para guardar los datos en la base de datos (por ejemplo, utilizando Firestore)
      await saveUserDataInDatabase(userData);
  
      // Enviar una respuesta al cliente
      res.status(200).json({ message: 'Inicio de sesión con Google exitoso' });
    } catch (error) {
      console.error('Error al verificar el token de Firebase:', error);
      res.status(401).json({ error: 'Token inválido' });
    }
  };
  
//   async function saveUserDataInDatabase(userData) {
//     // Lógica para guardar los datos del usuario en la base de datos
//     // Por ejemplo, utilizando Firestore o cualquier otra base de datos
  
//     // Ejemplo con Firestore
//     const firestore = admin.firestore();
//     const userRef = firestore.collection('users').doc(userData.uid);
//     await userRef.set(userData);
//   }
  
module.exports = {login}