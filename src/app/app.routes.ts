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

export const routes: Routes = [
    { path: '', redirectTo: '33934479/HongSze/statistics', pathMatch: 'full' },
    { path: '33934479/HongSze/add-driver', component: AddDriverComponent },
    { path: '33934479/HongSze/list-drivers', component: ListDriversComponent },
    { path: '33934479/HongSze/delete-driver', component: DeleteDriverComponent },
    { path: '33934479/HongSze/update-driver', component: UpdateDriverComponent },
    { path: '33934479/HongSze/add-package', component: AddPackageComponent },
    { path: '33934479/HongSze/list-packages', component: ListPackagesComponent },
    { path: '33934479/HongSze/delete-package', component: DeletePackageComponent },
    { path: '33934479/HongSze/update-package', component: UpdatePackageComponent },
    { path: '33934479/HongSze/statistics', component: StatisticsComponent },
    { path: '33934479/HongSze/invalid-data', component: InvalidDataComponent },
    { path: '**', component: PageNotFoundComponent } 
];
