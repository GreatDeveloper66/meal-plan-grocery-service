import express from 'express';

const router = express.Router();
//findNearestWalmartPlaceIdFromLatLng, getPlaceIdFromLatLng, etPlaceIdentification
import { findNearestWalmartPlaceIdFromLatLng, getPlaceIdFromLatLng, getPlaceIdentification, getPlaceDetails } from '../services/googleplacesServices';

router.get("/nearest-walmart", findNearestWalmartPlaceIdFromLatLng)
router.get("/place-id", getPlaceIdFromLatLng);
router.get("/place-identification", getPlaceIdentification);
router.get("/place-details", getPlaceDetails);

export default router;