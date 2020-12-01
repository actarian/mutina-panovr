import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import HttpService from '../http/http.service';

export default class ContactsSimpleComponent extends Component {

	onInit() {
		const form = new FormGroup({
			fullName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			// privacy: new FormControl(null, Validators.RequiredValidator()),
			checkRequest: window.antiforgery,
			checkField: '',
		});

		const controls = this.controls = form.controls;

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
		const role = this.controls.role.options.length ? this.controls.role.options[0].id : null;
		this.form.patch({
			fullName: 'Jhon Appleseed',
			email: 'jhonappleseed@gmail.com',
			// privacy: true,
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
					console.log('ContactsSimpleComponent.error', error);
					this.error = error;
					this.pushChanges();
				});
		} else {
			this.form.touched = true;
		}
	}

}

ContactsSimpleComponent.meta = {
	selector: '[contacts-simple]',
	inputs: ['flag']
};
