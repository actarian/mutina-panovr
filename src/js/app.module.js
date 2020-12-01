import { CoreModule, Module } from 'rxcomp';
import AppComponent from './app.component';
import AppearStaggerDirective from './appear/appear-stagger.directive';
import AppearDirective from './appear/appear.directive';
import ClickOutsideDirective from './click-outside/click-outside.directive';
import HtmlPipe from './html/html.pipe';
import ModalOutletComponent from './modal/modal-outlet.component';
import ModalComponent from './modal/modal.component';
import PanoVRComponent from './panovr/panovr.component';

export default class AppModule extends Module { }

AppModule.meta = {
	imports: [
		CoreModule,
	],
	declarations: [
		AppearDirective,
		AppearStaggerDirective,
		ClickOutsideDirective,
		HtmlPipe,
		ModalComponent,
		ModalOutletComponent,
		PanoVRComponent,
	],
	bootstrap: AppComponent,
};
