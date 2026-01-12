import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'company', component: CompanyDetailsComponent },
  { path: 'recruit', component: RecruitDetailsComponent },
  { path: '**', redirectTo: '' }
];
