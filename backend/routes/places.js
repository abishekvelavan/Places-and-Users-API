const express = require('express');
const router = express.Router();
const placesControllers = require('../controllers/places.js')

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);
router.post('/', placesControllers.createPlace);
router.patch('/:pid', placesControllers.updatePlace);
router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;