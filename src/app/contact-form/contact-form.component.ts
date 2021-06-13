import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {InputItemsValidator} from '../common/Inputs.validator';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ContactService} from '../services/contact.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})

export class ContactFormComponent implements OnInit {
  constructor(
    private service: ContactService,
    private route: ActivatedRoute,
    private  router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  private parameter: number;
  form = new FormGroup( {
    name: new FormControl('', [Validators.required]),
    contactType: new FormControl('', [Validators.required]),
    // tslint:disable-next-line:max-line-length
    phoneNumber: new FormControl('', [Validators.required, InputItemsValidator.isAPhoneNumber, Validators.minLength(7), Validators.maxLength(12)]),
    birthDate: new FormControl('', [Validators.required, InputItemsValidator.isDateBeforeToday])
  });

  onSubmit(): void {
    const item = this.GetContactFromForms();
    if (this.parameter === 0)
    {
      this.service.postContact(item)
        .subscribe(
          () => this.RedirectTo('/contacts-list'),
          error => this.HandleError(error));
    }
    else
    {
      this.service.updateContact(item, this.parameter )
        .subscribe(
          () => this.RedirectTo('/contacts-list'),
          error => this.HandleError(error));
    }
  }
  GetContactFromForms(): any{
    return {
      name: this.form.get('name').value,
      contactType: Number(this.form.get('contactType').value),
      phoneNumber: Number(this.form.get('phoneNumber').value),
      birthDate: this.form.get('birthDate').value};
  }
  RedirectTo(url: string): void{
    this.router.navigateByUrl(url);
  }
  HandleError(error): void{
    if (error.status === 400)
      { alert('The phone number already exist in the System. Please try with another number'); }
    else
      {alert('An unexpected error occurred.'); }
  }
  UpdateParameterWithGetRouteParam(): void{
    this.parameter = this.route.snapshot.paramMap.get('contactId') === 'new' ? 0 : Number(this.route.snapshot.paramMap.get('contactId'));
  }
  MappingResponseToFormFields(response): void{
    this.form.setValue(
      {
        name : response['name'],
        contactType : response['contactType'],
        phoneNumber : response['phoneNumber'],
        birthDate : response['birthDate'].substring(0, 10)
      });
  }
  ngOnInit(): void {
    this.UpdateParameterWithGetRouteParam();
    if (this.parameter !== 0)
    {
      this.service.getContact(this.parameter)
        .subscribe(
          response => {
            this.MappingResponseToFormFields(response);
          },
          error => {
            if (error.status === 404)
              { alert('This contact doesn\'t exist in the System.'); }
            else
              {alert('An unexpected error occurred.'); }
            this.router.navigateByUrl('/contacts-list');
          });
    }
  }

}
