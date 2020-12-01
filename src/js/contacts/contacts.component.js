import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import HttpService from '../http/http.service';

export default class ContactsComponent extends Component {

	onInit() {
		const data = window.data || {
			reason: [],
			firstCategory: [],
			secondCategory: []
		};

		const form = new FormGroup({
			fullName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			company: new FormControl(null, Validators.RequiredValidator()),
			reason: new FormControl(null, Validators.RequiredValidator()),
			firstCategory: new FormControl(null, Validators.RequiredValidator()),
			secondCategory: new FormControl(null, Validators.RequiredValidator()),
			message: new FormControl(null),
			privacy: new FormControl(null, Validators.RequiredValidator()),
			checkRequest: window.antiforgery,
			checkField: '',
		});

		const controls = this.controls = form.controls;
		controls.reason.options = data.reason;
		controls.firstCategory.options = data.firstCategory;
		controls.secondCategory.options = data.secondCategory;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			this.pushChanges();
		});

		this.form = form;
		this.error = null;
		this.success = false;
	}

	test() {
		const reason = this.controls.reason.options.length ? this.controls.reason.options[0].id : null;
		const firstCategory = this.controls.firstCategory.options.length ? this.controls.firstCategory.options[0].id : null;
		const secondCategory = this.controls.secondCategory.options.length ? this.controls.secondCategory.options[0].id : null;
		this.form.patch({
			fullName: 'Jhon Appleseed',
			email: 'jhonappleseed@gmail.com',
			company: 'Websolute',
			reason: reason,
			firstCategory: firstCategory,
			secondCategory: secondCategory,
			message: 'Hi!',
			privacy: true,
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		if (this.form.valid) {
			this.form.submitted = true;
			HttpService.post$('/api/contacts', this.form.value)
				.subscribe(response => {
					this.success = true;
					this.form.reset();
					// this.pushChanges();
					/*
					dataLayer.push({
						'event': 'formSubmission',
						'formType': 'Contacts'
					});
					*/
				}, error => {
					console.log('ContactsComponent.error', error);
					this.error = error;
					this.pushChanges();
				});
		} else {
			this.form.touched = true;
		}
	}

}

ContactsComponent.meta = {
	selector: '[contacts]',
	inputs: ['flag']
};
