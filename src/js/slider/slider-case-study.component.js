import { getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import SliderComponent from './slider.component';

export default class SliderCaseStudyComponent extends SliderComponent {

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
		return { 'transform': 'translate3d(' + -this.slideWidth * this.state.current + 'px, 0, 0)' };
	}

	get innerStyle() {
		return { 'width': this.slideWidth * this.items.length + 'px' };
	}

	get slideWidth() {
		const { node } = getContext(this);
		// const slides = Array.prototype.slice.call(node.querySelectorAll('.slider__slide'));
		const slideWidth = (window.innerWidth < 768 ? node.offsetWidth: (node.offsetWidth / 12 * 10)) + 40;
		return slideWidth;
	}

	onInit() {
		super.onInit();
		this.resize$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(() => this.pushChanges());
		/*
		this.changed$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe();
		setTimeout(() => {
			this.setActiveState();
		}, 500);
		*/
	}

	resize$() {
		return fromEvent(window, 'resize');
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

	onContentOver() {
		const { node } = getContext(this);
		node.classList.add('content-over');
	}

	onContentOut() {
		const { node } = getContext(this);
		node.classList.remove('content-over');
	}

	navTo(current) {
		super.navTo(current);
	}
}

SliderCaseStudyComponent.meta = {
	selector: '[slider-case-study]',
	inputs: ['items', 'current', 'autoplay'],
	outputs: ['change', 'tween'],
};
