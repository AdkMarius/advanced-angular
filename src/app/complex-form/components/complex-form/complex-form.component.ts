import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {group} from "@angular/animations";
import {map, Observable, startWith, tap} from "rxjs";
import {ComplexFormService} from "../../services/complex-form.service";
import {validValidator} from "../../validators/valid.validator";
import {confirmEqualValidator} from "../../validators/confirm-equal.validator";

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {
  loading: boolean = false;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  emailCtrl!: FormControl;
  emailConfirmCtrl!: FormControl;
  emailForm!: FormGroup;
  phoneCtrl!: FormControl;
  passwordCtrl!: FormControl;
  passwordConfirmCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showTelephoneCtrl$!: Observable<boolean>;
  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;

  constructor(private formBuilder: FormBuilder,
              private formService: ComplexFormService) {}

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
  }

  private initMainForm(): void {
    this.initFormControls();
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });
  }

  private initFormControls(): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.contactPreferenceCtrl = this.formBuilder.control('email');

    this.emailCtrl = this.formBuilder.control('');
    this.emailConfirmCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirmEmail: this.emailConfirmCtrl
    }, {
      validators: [
        confirmEqualValidator('email', 'confirmEmail')
      ],
      updateOn: 'blur'
    })

    this.phoneCtrl = this.formBuilder.control('');

    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.passwordConfirmCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.passwordConfirmCtrl
    }, {
      validators: [
        confirmEqualValidator('password', 'confirmPassword')
      ],
      updateOn: 'blur'
    })
  }

  private initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'email'),
      tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );

    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status =>
        status === 'INVALID' &&
        this.emailCtrl.value &&
        this.emailConfirmCtrl.value)
    );

    this.showTelephoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'telephone'),
      tap(showTelephoneControl => this.setTelephoneValidators(showTelephoneControl))
    );

    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(status =>
        status === 'INVALID' &&
        this.passwordCtrl.value
        && this.passwordConfirmCtrl.value &&
        this.loginInfoForm.hasError('confirmEqual')
      )
    );
  }

  private setEmailValidators(showEmailCtrl: boolean): void {
    if (showEmailCtrl) {
      this.emailCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
      this.emailConfirmCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
    } else {
      this.emailCtrl.clearValidators();
      this.emailConfirmCtrl.clearValidators();
    }

    this.emailCtrl.updateValueAndValidity();
    this.emailConfirmCtrl.updateValueAndValidity();
  }

  private setTelephoneValidators(showTelephoneControl: boolean): void {
    if (showTelephoneControl) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16)
      ])
    } else {
      this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity();
  }

  onSubmitForm() {
    this.loading = true;
    this.formService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log('Error while saving user information');
        }
      })
    ).subscribe();
  }

  private resetForm(): void {
    this.mainForm.reset();
    this.contactPreferenceCtrl.patchValue('email');
  }

  getFormControlErrorMessage(ctrl: AbstractControl) {
    if (ctrl.hasError('required'))
      return "Ce champ est requis";
    else if (ctrl.hasError('email'))
      return "Votre adresse email n'est pas valide";
    else if (ctrl.hasError('minlength'))
      return "Veuillez respecter le format";
    else if (ctrl.hasError('maxlength'))
      return "Veuillez respecter le format";

    return "Ce champ contient une erreur";
  }
}
