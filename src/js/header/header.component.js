import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import CssService from '../css/css.service';
// import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	onInit() {
		this.mainActive = false;
		CssService.height$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(height => {
			console.log('HeaderComponent.height$', height);
		});
	}

	onMainToggle() {
		this.mainActive = !this.mainActive;
		const { node } = getContext(this);
		const items = Array.prototype.slice.call(node.querySelectorAll('.nav--primary-menu > li'));
		gsap.to(items, {
			opacity: this.mainActive ? 1 : 0,
			duration: 0.35,
			stagger: {
				each: 0.05,
				ease: Power3.easeOut
			}
		});
		this.pushChanges();
		this.toggle.next(this.mainActive);
	}

	onOpenSub(subId) {
		this.subId = subId;
		this.pushChanges();
	}

	onCloseSub(subId) {
		if (this.subId === subId) {
			this.subId = null;
			this.pushChanges();
		}
	}

	isSubOpen(subId) {
		return this.subId === subId;
	}

	isPrimaryHidden() {
		return this.subId != null;
	}

	showPicture(src) {
		const { node } = getContext(this);
		const picture = node.querySelector('.main-menu__picture');
		let img;
		if (src) {
			img = document.createElement('img');
			img.onload = () => {
				picture.appendChild(img);
				gsap.set(img, { opacity: 0 });
				gsap.to(img, {
					opacity: 1,
					duration: 0.35,
					onComplete: () => {
						while(picture.childElementCount > 1) {
							picture.removeChild(picture.children[0]);
						}
					},
				});
			};
			img.src = src;
		} else {
			img = picture.querySelector('img');
			if (img) {
				gsap.to(img, {
					opacity: 0,
					duration: 0.35,
					onComplete: () => {
						while(picture.childElementCount > 0) {
							picture.removeChild(picture.children[0]);
						}
					},
				});
			}
		}
	}
}

HeaderComponent.meta = {
	selector: 'header',
	outputs: ['toggle']
};
