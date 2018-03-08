const express = require('express');
var auth = require('./controllers/auth');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/auth/users', (req, res) => { auth.allUsers(req, res) });
router.post('/auth/login', (req, res) => { auth.login(req, res) });
router.post('/auth/signup', (req, res) => { auth.signup(req, res) });
router.put('/auth/update/:id', (req, res) => { auth.updateUser(req, res) });

module.exports = router;





