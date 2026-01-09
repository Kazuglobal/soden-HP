import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { NewsComponent } from './components/news/news.component';
import { BlogComponent } from './components/blog/blog.component';
import { WhatWeDoComponent } from './components/what-we-do/what-we-do.component';
import { FeatureComponent } from './components/feature/feature.component';
import { MembersComponent } from './components/members/members.component';
import { CompanyComponent } from './components/company/company.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecruitComponent } from './components/recruit/recruit.component';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { CasesComponent } from './components/cases/cases.component';
import { StaffComponent } from './components/staff/staff.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    HeroComponent,
    NewsComponent,
    BlogComponent,
    WhatWeDoComponent,
    FeatureComponent,
    MembersComponent,
    CompanyComponent,
    RecruitComponent,
    ContactComponent,
    FooterComponent,
    CustomCursorComponent,
    CasesComponent,
    StaffComponent
  ]
})
export class AppComponent { }
