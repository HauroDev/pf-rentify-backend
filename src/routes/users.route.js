const { Router } = require('express')

const {
  postUser,
  getUser
  //   putUser, deleteUser, getUserMember
} = require('../controller/users.controller.js')

const router = Router()

// metodos get
router.get('/:id', getUser)
// router.get('/ aca iria  qry  de esta manera en testeo /users?membership=standard'  ,getUserMember);

// metodos post
router.post('/', postUser)

// metodos put
// router.put('/:id',putUser);

// metodos delete
// router.delete('/:id', deleteUser);
module.exports = router