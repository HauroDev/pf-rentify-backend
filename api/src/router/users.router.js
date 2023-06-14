const { Router } = require('express');

const {postUser, getUser
//   putUser, deleteUser, getUserMember
}=require('../controller/users.js');

const router= Router();

//metodos get
router.get('/detail/:id', getUser); 
// router.get('/',getUserMember); 

//metodos post
router.post('/', postUser);  

//metodos put
// router.put('/',putUser);

//metodos delete
// router.delete('/', deleteUser);
module.exports = router;
