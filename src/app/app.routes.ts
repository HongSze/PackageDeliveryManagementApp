import { Routes } from '@angular/router';
import { AddDriverComponent } from './components/add-driver/add-driver.component';
import { ListDriversComponent } from './components/list-drivers/list-drivers.component';
import { DeleteDriverComponent } from './components/delete-driver/delete-driver.component';
import { UpdateDriverComponent } from './components/update-driver/update-driver.component';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { ListPackagesComponent } from './components/list-packages/list-packages.component';
import { DeletePackageComponent } from './components/delete-package/delete-package.component';
import { UpdatePackageComponent } from './components/update-package/update-package.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { InvalidDataComponent } from './components/invalid-data/invalid-data.component';
import { TranslateDescriptionComponent } from './components/translate-description/translate-description.component';
import { TextToSpeechComponent } from './components/text-to-speech/text-to-speech.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './auth.guard';
import { GenerativeComponent } from './components/generative/generative.component';


export const routes: Routes = [
    { path: '', redirectTo: '33934479/HongSze/statistics', pathMatch: 'full' },
    { path: '33934479/HongSze/add-driver', component: AddDriverComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/list-drivers', component: ListDriversComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/delete-driver', component: DeleteDriverComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/update-driver', component: UpdateDriverComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/add-package', component: AddPackageComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/list-packages', component: ListPackagesComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/delete-package', component: DeletePackageComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/update-package', component: UpdatePackageComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/translate-description', component: TranslateDescriptionComponent, canActivate: [AuthGuard] }, 
    { path: '33934479/HongSze/generative', component: GenerativeComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/text-to-speech', component: TextToSpeechComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/invalid-data', component: InvalidDataComponent, canActivate: [AuthGuard] },
    { path: '33934479/HongSze/login', component: LoginComponent },
    { path: '33934479/HongSze/signup', component: SignupComponent },
    { path: '**', component: PageNotFoundComponent } 
];
