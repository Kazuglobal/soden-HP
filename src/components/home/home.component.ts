import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { NewsComponent } from '../news/news.component';
import { WhatWeDoComponent } from '../what-we-do/what-we-do.component';
import { CasesComponent } from '../cases/cases.component';
import { FeatureComponent } from '../feature/feature.component';
import { MembersComponent } from '../members/members.component';
import { CompanyComponent } from '../company/company.component';
import { RecruitComponent } from '../recruit/recruit.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    NewsComponent,
    WhatWeDoComponent,
    CasesComponent,
    FeatureComponent,
    CompanyComponent,
    RecruitComponent,
    ContactComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-news></app-news>
    <app-what-we-do></app-what-we-do>
    <app-cases></app-cases>
    <app-feature></app-feature>
    <app-feature></app-feature>
    <app-company></app-company>
    <app-recruit></app-recruit>
    <app-contact></app-contact>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent { }
