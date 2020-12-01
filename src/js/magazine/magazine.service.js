import { map } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { STATIC } from '../environment';

export default class MagazineService {

	static all$() {
		if (STATIC) {
			return ApiService.staticGet$('/magazine/all').pipe(map(response => response.data));
		} else {
			return ApiService.get$('/magazine/all').pipe(map(response => response.data));
		}
	}

	static filters$() {
		if (STATIC) {
			return ApiService.staticGet$('/magazine/filters').pipe(map(response => response.data));
		} else {
			return ApiService.get$('/magazine/filters').pipe(map(response => response.data));
		}
	}

}
