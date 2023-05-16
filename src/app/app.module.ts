import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { JwtModule } from '@auth0/angular-jwt';
import { ACCESS_TOKEN_STORAGE_KEY } from './core/models/auth.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
      AppRoutingModule,
      AppLayoutModule,
      GoogleMapsModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
        }
      }),
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
