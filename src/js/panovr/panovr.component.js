


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
			{ title: 'Title 03', abstract: 'abstract 03' },
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
		pano.readConfigUrl(this.panovr);
		const nodes = pano.getNodeIds();
		console.log('getNodeIds', nodes);
		console.log('getNodeUserdata', pano.getNodeUserdata(nodes[0]));
		console.log('getNodeLatLng', pano.getNodeLatLng(nodes[0]));
		console.log('getPointHotspotIds', pano.getPointHotspotIds());
		console.log('getCurrentPointHotspots', pano.getCurrentPointHotspots());
		pano.on('sizechanged', (event) => {
			console.log('sizechanged', event);
		})
		// this.addHotSpot(pano, 0, 0);
		// this.addHotSpot(pano, 0, -30);
		// this.addHotSpot(pano, -70, 0);
	}

	addHotSpot(pano, x, y) {
		const hotspot = document.createElement('div');
		hotspot.classList.add('hotspot');
		hotspot.addEventListener('click', (e) => {
			console.log(this, e);
		});
		pano.addHotspot(`hotspot-${++PANO_UID}`, x, y, hotspot);
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

