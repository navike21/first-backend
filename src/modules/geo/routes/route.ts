import { Router } from 'express';
import {
	GEO_PATH_COUNTRIES,
	GEO_PATH_DIVISIONS,
	GEO_PATH_DIVISIONS_CHILDREN,
} from '../constants/paths';
import { geoCountriesController } from '../controllers/geo.countries';
import { geoDivisionsController } from '../controllers/geo.divisions';

// Public reference data (countries + administrative divisions). No auth: it is
// non-sensitive public data consumed by both public and admin forms.
export function geoApi(router: Router) {
	router.get(GEO_PATH_COUNTRIES, geoCountriesController);
	router.get(GEO_PATH_DIVISIONS, geoDivisionsController);
	router.get(GEO_PATH_DIVISIONS_CHILDREN, geoDivisionsController);
}
