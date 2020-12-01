import { Component } from 'rxcomp';
import DropdownDirective from '../dropdown/dropdown.directive';

export default class MagazineDropdownComponent extends Component {

	onInit() {
		this.dropdownId = DropdownDirective.nextId();
	}

}

MagazineDropdownComponent.meta = {
	selector: '[magazine-dropdown]',
	inputs: ['label', 'filter'],
	template: /* html */ `
		<span class="text" [innerHTML]="label"></span>
		<span class="btn--dropdown" [dropdown]="dropdownId">
			<span [innerHTML]="filter.label"></span> <svg class="filter"><use xlink:href="#filter"></use></svg>
			<!-- dropdown -->
			<div class="dropdown" [dropdown-item]="dropdownId">
				<div class="category" [innerHTML]="filter.label"></div>
				<ul class="nav--dropdown">
					<li *for="let item of filter.options">
						<span [class]="{ active: filter.has(item), disabled: item.disabled }" (click)="filter.set(item)" [innerHTML]="item.label"></span>
					</li>
				</ul>
			</div>
		</span>
	`
};
