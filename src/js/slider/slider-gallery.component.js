import SliderComponent from './slider.component';

export default class SliderGalleryComponent extends SliderComponent {

	get items() {
		return this.items_ || [];
	}
	set items(items) {
		if (this.items_ !== items) {
			this.items_ = items;
		}
	}

	get current() {
		return this.state.current || 0;
	}
	set current(current = 0) {
		if (this.state.current !== current) {
			this.state.current = current;
			this.change.next(current);
		}
	}

	get state() {
		if (!this.state_) {
			this.state_ = { current: 0 };
		}
		return this.state_;
	}

	get wrapperStyle() {
		return { 'transform': 'translate3d(' + -100 * this.state.current + '%, 0, 0)' };
	}

	get innerStyle() {
		return { 'width': 100 * this.items.length + '%' };
	}

	onInit() {
		super.onInit();
		/*
		this.changed$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe();
		setTimeout(() => {
			this.setActiveState();
		}, 500);
		*/
	}

	/*
	changed$() {
		return this.change.pipe(
			tap(() => this.setActiveState()),
		);
	}

	setActiveState() {
		const current = this.current;
		const { node } = getContext(this);
		const slides = Array.prototype.slice.call(node.querySelectorAll('.slider__slide'));
		slides.forEach((slide, i) => i === current ? slide.classList.add('active') : slide.classList.remove('active'));
	}
	*/

	navTo(current) {
		super.navTo(current);
	}

	doClose() {
		this.close.next();
	}

	toggleMode() {
		this.mode.next();
	}
}

SliderGalleryComponent.meta = {
	selector: '[slider-gallery]',
	inputs: ['items', 'current', 'autoplay'],
	outputs: ['change', 'tween', 'close', 'mode'],
};
