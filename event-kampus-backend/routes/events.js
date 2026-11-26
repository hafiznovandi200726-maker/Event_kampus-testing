const router = require('express').Router();
const controller = require('../controllers/eventsController');
const auth = require('../middleware/auth');
const validateEvent = require('../middleware/validateEvent');

router.get('/', controller.list);
router.get('/:id', controller.detail);
router.post('/', auth, validateEvent, controller.create);
router.put('/:id', auth, validateEvent, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
