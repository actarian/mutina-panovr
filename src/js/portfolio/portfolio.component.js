import { Component, getContext } from 'rxcomp';
import { combineLatest, fromEvent } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import PortfolioService from './portfolio.service';

const ITEMS_PER_PAGE = 9;

export default class PortfolioComponent extends Component {

	onInit() {
		this.maxVisibleItems = ITEMS_PER_PAGE;
		this.firstItem = null;
		this.visibleItems = null;
		this.items = [];
		this.filters = {};
		this.busy = true;
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.busy = false;
			this.items = data[0];
			this.filters = data[1];
			this.onLoad();
			this.pushChanges();
		});
	}

	onLoad() {
		const items = this.items;
		const filters = this.filters;
		Object.keys(filters).forEach(key => {
			filters[key].mode = FilterMode.SELECT;
		});
		const initialParams = {};
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				case 'area':
				case 'city':
					filter.filter = (item, value) => {
						return item[key] === value;
					};
				break;
			}
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		filterService.items$(items).pipe(
			map(items => this.sortPatternItems(items)),
			takeUntil(this.unsubscribe$),
		).subscribe(items => {
			this.maxVisibleItems = ITEMS_PER_PAGE;
			this.items = items;
			this.visibleItems = items.slice(0, this.maxVisibleItems);
			this.pushChanges();
		});
		this.scroll$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe();
	}

	sortPatternItems(items) {
		const copy = items.slice();
		const firstItem = this.firstItem = copy.find(x => x.important);
		if (firstItem) {
			copy.splice(copy.indexOf(firstItem), 1);
		}
		const order = [false, false, true, false, false, false, false, true];
		const sorted = [];
		let	i = 0;
		while (copy.length) {
			const important = order[i % order.length];
			const item = copy.find(x => x.important === important);
			if (item) {
				copy.splice(copy.indexOf(item), 1);
				sorted.push(item);
			} else {
				sorted.push(copy.shift());
			}
			i++;
		}
		return sorted;
	}

	scroll$() {
		const { node } = getContext(this);
		return fromEvent(window, 'scroll').pipe(
			tap(() => {
				if (this.items.length > this.visibleItems.length && !this.busy) {
					const rect = node.getBoundingClientRect();
					if (rect.bottom < window.innerHeight) {
						this.busy = true;
						this.pushChanges();
						setTimeout(() => {
							this.busy = false;
							this.maxVisibleItems += ITEMS_PER_PAGE;
							this.visibleItems = this.items.slice(0, this.maxVisibleItems);
							this.pushChanges();
						}, 1000);
					}
				}
			})
		);
	}

	load$() {
		return combineLatest([
			PortfolioService.all$(),
			PortfolioService.filters$(),
		]);
	}

	toggleFilter(filter) {
		Object.keys(this.filters).forEach(key => {
			const f = this.filters[key];
			if (f === filter) {
				f.active = !f.active;
			} else {
				f.active = false;
			}
		});
		this.pushChanges();
	}

	clearFilter(event, filter) {
		event.preventDefault();
		event.stopImmediatePropagation();
		filter.clear();
		this.pushChanges();
	}
}

PortfolioComponent.meta = {
	selector: '[portfolio]',
};
