


import { Component, getContext } from 'rxcomp';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

let PANO_UID = 0;

const listeners = {};

const alignment = {
	TL: 'TL',
	TO: 'TO',
	TR: 'TR',
	LE: 'LE',
	CE: 'CE',
	RI: 'RI',
	BL: 'BL',
	BO: 'BO',
	BR: 'BR',
};

export default class PanoVRComponent extends Component {

	static onClickedPin(clickedUid, clickedIndex) {
		// console.log('PanoVRComponent.onClickedPin', clickedUid, clickedIndex);
		Object.keys(listeners).forEach(uid => {
			if (clickedUid === parseInt(uid)) {
				const instance = listeners[uid];
				instance.onClickedPin.call(instance, clickedIndex);
			}
		});
	}

	static register(uid, instance) {
		listeners[uid] = instance;
	}

	static unregister(uid) {
		delete listeners[uid];
	}

	getNode() {
		const { node } = getContext(this);
		return node;
	}

	onInit() {
		const uid = this.uid = ++PANO_UID;
		PanoVRComponent.register(uid, this);
		this.items = [];
		this.item = null;
		this.load$().pipe(
			first(),
		).subscribe(items => {
			this.items = items;
			this.loadPanoVr();
		});
	}

	onDestroy() {
		PanoVRComponent.unregister(uid);
	}

	load$() {
		return of([
			{ id: 1, title: 'End Piece L', abstract: 'Black painted metal on dark oak', image: '/mutina-panovr/img/panovr/end-piece-l.jpg',  link: { url: '#', title: 'Accents Wood Collection' } },
			{ id: 2, title: 'End Piece L 2', abstract: 'Black painted metal on dark oak', image: '/mutina-panovr/img/panovr/end-piece-l.jpg', link: { url: '#', title: 'Accents Wood Collection' } },
			{ id: 3, title: 'End Piece L 3', abstract: 'Black painted metal on dark oak', image: '/mutina-panovr/img/panovr/end-piece-l.jpg', link: { url: '#', title: 'Accents Wood Collection' } },
		]);
	}

	loadPanoVr() {
		const node = this.getNode();
		const name = `panovr-${this.uid}`;
		const inner = node.querySelector('.panovr__inner');
		inner.setAttribute('id', name);
		console.log(inner);
		// window.onClickedPin = this.onClickedPin.bind(this);
		// create the panorama player with the container
		const pano = this.pano = new pano2vrPlayer(name);
		// add the skin object
		const skin = new pano2vrSkin(pano);
		// load the configuration
		pano.setBasePath(this.getBasePath(this.panovr));
		this.loadPanoVR(this.panovr, (xmlString) => {
			this.parsePanoVRString(xmlString);
		});
		/*
		this.loadPanoVRXML(this.panovr, (xml) => {
			this.parsePanoVRXML(xml);
		});
		*/
		/*
		this.readPanoVRXML(this.panovr);
		*/
	}

	getBasePath(url) {
		// http://127.0.0.1:42345/mutina-panovr/panovr/exampletiles/node4/cf_0/l_1/c_1/tile_0.jpg
		const segments = url.split('/');
		segments.pop();
		return segments.join('/') + '/';
	}

	loadPanoVR(url, callback) {
		function onLoad() {
			// console.log(this.responseText);
			if (typeof callback === 'function') {
				callback(this.responseText);
			}
		}
		const request = new XMLHttpRequest();
		request.onload = onLoad;
		request.open('GET', url);
		request.send();
	}

	parsePanoVRString(xmlString) {
		xmlString = xmlString.replace(/javascript\:onClickedPin\(/g, `javascript:onClickedPin(${this.uid},`);
		// console.log('xmlString', xmlString);
		const pano = this.pano;
		// .then(data => console.log('panovr', data));
		pano.readConfigString(xmlString);
		// pano.readConfigUrl(this.panovr);
		this.initPanoVR();
	}

	loadPanoVRXML(url, callback) {
		function onLoad() {
			// console.log(this.responseXML);
			if (typeof callback === 'function') {
				callback(this.responseXML);
			}
		}
		const request = new XMLHttpRequest();
		request.onload = onLoad;
		request.open('GET', url);
		request.send();
		/*
		fetch(this.panovr)
		.then(response => response.text())
		.then(text => (new window.DOMParser()).parseFromString(text, 'text/xml'))
		.then(xml => {
			this.parsePanoVRXML(xml);
		});
		*/
	}

	parsePanoVRXML(xml) {
		const pano = this.pano;
		// .then(data => console.log('panovr', data));
		pano.readConfigXml(xml);
		// pano.readConfigUrl(this.panovr);
		this.initPanoVR();
	}

	readPanoVRXML(url) {
		const pano = this.pano;
		pano.readConfigUrl(url);
		this.initPanoVR();
	}

	initPanoVR() {
		const pano = this.pano;
		const nodes = pano.getNodeIds();
		// console.log('getNodeIds', nodes);
		// console.log('getNodeUserdata', pano.getNodeUserdata(nodes[0]));
		// console.log('getNodeLatLng', pano.getNodeLatLng(nodes[0]));
		// console.log('getPointHotspotIds', pano.getPointHotspotIds());
		// console.log('getCurrentPointHotspots', pano.getCurrentPointHotspots());
		pano.getPointHotspotIds().forEach(id => {
			const hotSpot = pano.getHotspot(id);
			// console.log('hotSpot', hotSpot);
			if (hotSpot.url.indexOf('onClickedPin') !== -1) {
				hotSpot.url = `javascript:alert('pippo');`;
				// console.log('url', hotSpot.url);
				/*
				hotSpot.div.onClick = function() {
					console.log('hello');
				}
				*/
				/*
				pano.addHotspot(id,hotSpot.pan,hotSpot.tilt,hotSpot.div);
				*/
			}
		});
		/*
		pano.on('sizechanged', (event) => {
			console.log('sizechanged', event);
		});
		*/
		pano.on('repaint', (event) => {
			this.onRepaint(event);
		});
		this.onClickOutside = this.onClickOutside.bind(this);
		document.addEventListener('click', this.onClickOutside);
		// this.addHotSpot(pano, 0, 0);
		// this.addHotSpot(pano, 0, -30);
		// this.addHotSpot(pano, -70, 0);
	}

	/*
	addHotSpot(pano, x, y) {
		const hotspot = document.createElement('div');
		hotspot.classList.add('hotspot');
		hotspot.addEventListener('click', (e) => {
			console.log(this, e);
		});
		pano.addHotspot(`hotspot-${++PANO_UID}`, x, y, hotspot);
	}
	*/

	onClickOutside(event) {
		// console.log('onClickOutside', event.target);
		const node = this.getNode();
		const toast = node.querySelector('.panovr-toast');
		if (!PanoVRComponent.isChildOfNode(event.target, toast)) {
			this.index = null;
			this.item = null;
			this.removeToast();
			this.pushChanges();
		}
	}

	static isChildOfNode(child, node) {
		if (!child || !node) {
			return false;
		}
		if (child === node) {
			return true;
		} else if (child.parentNode) {
			return this.isChildOfNode(child.parentNode, node);
		} else {
			return false;
		}
	}

	onClickedPin(index) {
		// console.log('onClickedPin', index);
		this.index = index;
		this.item = this.items[index];
		this.addToast(this.item);
		// this.pushChanges();
		this.pin.next(index);
		this.onRepaint();
	}

	addToast(item) {
		this.removeToast();
		const template = /* html */`
		<div class="panovr-toast">
			<div class="panovr-toast__content">
				<div class="panovr-toast__title">${item.title}</div>
				<div class="panovr-toast__abstract">${item.abstract}</div>
				<div class="panovr-toast__group-cta">
					<a class="panovr-toast__cta" href="${item.link.url}">${item.link.title}</a>
					<a class="panovr-toast__cta">Add to samples</a>
				</div>
			</div>
			<div class="panovr-toast__picture">
				<img src="${item.image}" />
			</div>
			<!-- <div class="panovr-toast__close" (click)="onToastClose($event)">x</div> -->
		</div>
		`;
		const node = this.getNode();
		const temp = document.createElement('div');
		temp.innerHTML = template;
		node.appendChild(temp.firstElementChild);
	}

	removeToast() {
		const node = this.getNode();
		const toast = node.querySelector('.panovr-toast');
		if (toast) {
			toast.parentElement.removeChild(toast);
		}
	}

	onRepaint() {
		const index = this.index;
		if (index != null) {
			const node = this.getNode();
			const toast = node.querySelector('.panovr-toast');
			if (toast) {
				const pano = this.pano;
				const hotSpot = pano.getPointHotspotIds().map(id => pano.getHotspot(id)).find(hotSpot => {
					return hotSpot.url === `javascript:onClickedPin(${this.uid},${index});`;
				});
				let x = 0;
				let y = 0;
				if (hotSpot) {
					const nodeRect = node.getBoundingClientRect();
					const hotSpotDiv = hotSpot.div;
					const rect = hotSpotDiv.getBoundingClientRect();
					// console.log(rect, hotSpot, hotSpotDiv);
					x = rect.x - nodeRect.x;
					y = rect.y - nodeRect.y;
					const dx = x / nodeRect.width;
					const dy = y / nodeRect.height;
					const ax = Math.floor(dx * 3) - 1;
					const ay = Math.floor(dy * 3) - 1;
					toast.classList.remove('left', 'right', 'top', 'bottom');
					/*
					toast.classList.remove('left', 'center', 'right', 'top', 'middle', 'bottom');
					toast.classList.add(['left', 'center', 'right'][ax]);
					toast.classList.add(['top', 'middle', 'bottom'][ay]);
					*/
					let tx = x;
					let ty = y;
					const tw = toast.offsetWidth;
					const th = toast.offsetHeight;
					const gx = 30;
					const gy = 30;
					if (ax < 0) {
						// left
						if (ay < 0) {
							// top
							tx = x + gx;
							ty = y + gy;
						} else if (ay === 0) {
							// middle
							tx = x + gx;
							ty = y - th / 2;
							toast.classList.add('left');
						} else if (ay > 0) {
							// bottom
							tx = x + gx;
							ty = y - gy - th;
						}
					} else if (ax === 0) {
						// center
						if (ay < 0) {
							// top
							tx = x - tw / 2;
							ty = y + gy;
							toast.classList.add('top');
						} else if (ay === 0) {
							// middle
							tx = x - tw / 2;
							ty = y + gy;
							toast.classList.add('top');
						} else if (ay > 0) {
							// bottom
							tx = x - tw / 2;
							ty = y - gy - th;
							toast.classList.add('bottom');
						}
					} else if (ax > 0) {
						// right
						if (ay < 0) {
							// top
							tx = x - gx - tw;
							ty = y + gy;
						} else if (ay === 0) {
							// middle
							tx = x - gx - tw;
							ty = y - th / 2;
							toast.classList.add('right');
						} else if (ay > 0) {
							// bottom
							tx = x - gx - tw;
							ty = y - gy - th;
						}
					}
					// console.log(ax, ay, tx, ty, tw, th);
					toast.style.position = 'absolute';
					toast.style.left = `${tx}px`;
					toast.style.top = `${ty}px`;
					// [style]="{ position: 'absolute', left: x + 'px', top: y + 'px' }"
				}
			}
		}
	}

	onToastClose(event) {
		// console.log('onToastClose');
		this.item = null;
		this.pushChanges();
	}

}

PanoVRComponent.meta = {
	selector: '[panovr]',
	outputs: ['pin'],
	inputs: ['panovr']
};

window.onClickedPin = PanoVRComponent.onClickedPin;
