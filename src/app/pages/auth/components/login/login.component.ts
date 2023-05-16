import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgOtpInputComponent } from 'ng-otp-input';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import {debounceTime, finalize, ReplaySubject, takeUntil} from "rxjs";
import {map, tap} from "rxjs/operators";
import {LoginDataResponse, LoginResponse, OTPRetryResponse} from '../../../../core/models/auth.model';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('otpInput') public otpInput!: NgOtpInputComponent;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', [Validators.required]],
  });

  otpFormControl = new FormControl();
  isPreliminaryValid = false;
  isLoading = false;
  retryTimer!: string;
  token!: string;
  otpValidationMessage!: string;
  timeLeft!: number;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.listenToOtpForm()
  }

  onLogin() {
    if (this.loginForm?.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.login();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private login() {
    const formValue = this.loginForm.value;
    this.isLoading = true;

    this.authService
      .login(formValue.email, formValue.password)
      .pipe(
        map((response: LoginResponse) => response.data),
        tap((loginData: LoginDataResponse) => {
          this.token = loginData.token;
        }),
        finalize(() => {
          this.isLoading = false;
          this.isPreliminaryValid = true;
        })
      )
      .subscribe(
        () => {},
        (err: HttpErrorResponse) => {
          this.isPreliminaryValid = false;
        }
      );
  }

  public onResendOTP(): void {
    this.isLoading = true;

    this.authService
      .retryOTP(this.token)
      .pipe(
        tap((response: OTPRetryResponse) => (this.retryTimer = response.data.retry)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        () => {},
        (err: HttpErrorResponse) => {
          this.otpValidationMessage = err.error?.error?.msg;
        }
      );
  }

  public onCheckOTP(event: string): void {
    this.authService
      .checkOTP(event, this.token)
      .subscribe(otpResponse => {
        this.authService.setAccessToken(otpResponse);
        this.authService.setWalletData();
        void this.router.navigate(['/']);
      },
      (err: HttpErrorResponse) => {
        this.otpValidationMessage = err.error?.error?.msg;
      }
    );
  }

  private listenToOtpForm(): void {
    this.otpFormControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(200),
        tap(code => {
          if (code.length === 4) {
            this.onCheckOTP(code);
          }
        })
      )
      .subscribe();
  }

}
