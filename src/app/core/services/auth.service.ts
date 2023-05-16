import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError, catchError} from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Sha1Service } from './sha1.service';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AccessTokenData,
  LoginResponse,
  OTPResponse,
  OTPRetryResponse
} from '../models/auth.model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public walletData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get walletData$() {
    return this.walletData.asObservable();
  }

  constructor(
    private http: HttpClient,
    private sha1Service: Sha1Service,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private walletService: WalletService
  ) {
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password: this.sha1Service.hashString(password) })
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  public logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, null).pipe(
      tap(() => {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, '');
        this.loggedIn.next(false);
        void this.router.navigate(['/login']);
      }),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  public checkOTP(code: string, token: string): Observable<OTPResponse> {
    return this.http
      .post<OTPResponse>(`${this.apiUrl}/otp-check`, { code, token })
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  public retryOTP(token: string): Observable<OTPRetryResponse> {
    return this.http
      .post<OTPRetryResponse>(`${this.apiUrl}/otp-retry`, { token })
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  public setAccessToken(otpResponse: OTPResponse): void {
    const { access_token } = otpResponse.data;

    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);
  }

  public isAuthenticated(): boolean {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '';
    if (accessToken) {
      const decodedToken = this.jwtHelper.decodeToken(accessToken);
      this.loggedIn.next(true);
      // if (!this.walletData.value) {
      //   this.setWalletData();
      // }
      return !this.jwtHelper.isTokenExpired(accessToken) && !!decodedToken;
    }
    this.loggedIn.next(false);
    return false;
  }

  public getUserData(): AccessTokenData | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '';
    return accessToken ? this.jwtHelper.decodeToken(accessToken) : null;
  }

  setWalletData(): void {
    this.walletService.getWalletData()
      .subscribe((res: any) => {
        this.walletData.next(res.data);
      });
  }
}
