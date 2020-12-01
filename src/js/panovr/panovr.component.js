


import { Component, getContext } from 'rxcomp';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

let PANO_UID = 0;

export default class PanoVRComponent extends Component {

	onInit() {
		this.items = [];
		this.item = null;
		this.load$().pipe(
			first(),
		).subscribe(items => {
			this.items = items;
			this.loadPanoVr();
		});
	}

	load$() {
		return of([
			{ title: 'Title 01', abstract: 'abstract 01' },
			{ title: 'Title 02', abstract: 'abstract 02' },
		]);
	}

	loadPanoVr() {
		const { node } = getContext(this);
		const inner = node.querySelector('.inner');
		const name = `panovr-${++PANO_UID}`;
		inner.setAttribute('id', name);
		window.onClickedPin = this.onClickedPin.bind(this);
		// create the panorama player with the container
		const pano = new pano2vrPlayer(name);
		// add the skin object
		const skin = new pano2vrSkin(pano);
		// load the configuration
		pano.readConfigUrlAsync(this.panovr);
	}

	onClickedPin(index) {
		console.log('onClickedPin', index);
		this.item = this.items[index];
		this.pushChanges();
		this.pin.next(index);
	}

	onToastClose(event) {
		console.log('onToastClose');
		this.item = null;
		this.pushChanges();
	}

}

PanoVRComponent.meta = {
	selector: '[panovr]',
	outputs: ['pin'],
	inputs: ['panovr']
};

