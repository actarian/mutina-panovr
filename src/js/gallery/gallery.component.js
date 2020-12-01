import { Component, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BASE_HREF } from '../environment';
import ModalService from '../modal/modal.service';

const GALLERY_MODAL = BASE_HREF + 'gallery-modal.html';

export default class GalleryComponent extends Component {

	get galleryItems() {
		if (typeof this.gallery === 'string') {
			return [this.gallery];
		} else if (Array.isArray(this.gallery)) {
			return this.gallery;
		} else {
			return [];
		}
	}

	get firstGalleryItem() {
		const items = this.galleryItems;
		if (items.length) {
			return items[0];
		}
	}

	onInit() {
		this.galleryItems.forEach(item => {
			if (GalleryComponent.items.indexOf(item) === -1) {
				GalleryComponent.items.push(item);
			}
		});
		this.click$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(event => this.onOpenGallery(event));
	}

	click$() {
		const {node} = getContext(this);
		return fromEvent(node, 'click');
	}

	onOpenGallery(event) {
		const items = GalleryComponent.items;
		const index = items.indexOf(this.firstGalleryItem);
		// console.log('GalleryComponent.onOpenGallery', this.gallery, items, index);
		ModalService.open$({ src: GALLERY_MODAL, data: { items, index } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// this.pushChanges();
		});
	}
}

GalleryComponent.items = [];

GalleryComponent.meta = {
	selector: '[gallery]',
	inputs: ['gallery']
};
