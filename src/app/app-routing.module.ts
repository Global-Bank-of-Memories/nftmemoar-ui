import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import {authGuard} from "./core/guards/auth.guard";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: AppLayoutComponent,
                children: [
                    { path: '', redirectTo: '/places', pathMatch: 'full' },
                    { path: 'login', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
                    {
                      path: 'places',
                      canActivate: [authGuard],
                      loadChildren: () => import('./pages/places/places.module').then(m => m.PlacesModule)
                    },
                ]
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
