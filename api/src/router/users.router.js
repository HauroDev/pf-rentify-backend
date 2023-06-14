const { Router } = require('express');

const {postUser, getUser,getUsersByStatus
//   putUser, deleteUser, getUserMember
}=require('../controller/users.js');

const router= Router();

//metodos get
router.get('/:id', getUser); 
router.get ('/',getUsersByStatus)
// router.get('/ aca iria  qry  de esta manera en testeo /users?membership=standard'  ,getUserMember); 

//metodos post
router.post('/', postUser);  

//metodos put
// router.put('/:id',putUser);

//metodos delete
// router.delete('/:id', deleteUser);
module.exports = router;
