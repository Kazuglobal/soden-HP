import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { NewsComponent } from './components/news/news.component';
import { BlogComponent } from './components/blog/blog.component';
import { WhatWeDoComponent } from './components/what-we-do/what-we-do.component';
import { FeatureComponent } from './components/feature/feature.component';
import { MembersComponent } from './components/members/members.component';
import { ForClientsComponent } from './components/for-clients/for-clients.component';
import { CompanyComponent } from './components/company/company.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecruitComponent } from './components/recruit/recruit.component';

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
    ForClientsComponent,
    CompanyComponent,
    RecruitComponent,
    ContactComponent,
    FooterComponent
  ]
})
export class AppComponent { }
