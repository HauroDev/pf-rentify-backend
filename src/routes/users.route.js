const { Router } = require('express')

const {
  postUser,
  getUser,
  getUsersByStatus,
  getAllUsers,
  getUserMember
  //   putUser, deleteUser, getUserMember
} = require('../controller/users.controller.js')

const router = Router()

// metodos get
router.get('/users',getAllUsers)
router.get('/:id', getUser)
// problemas en la parte  delos filtrados 
router.get ('/s',getUsersByStatus)
router.get('/',getUserMember);

// metodos post
router.post('/', postUser)

// metodos put
// router.put('/:id',putUser);

// metodos delete
// router.delete('/:id', deleteUser);
module.exports = router
