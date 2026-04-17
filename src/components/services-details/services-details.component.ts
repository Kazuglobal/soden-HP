import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WhatWeDoComponent } from '../what-we-do/what-we-do.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-services-details',
  standalone: true,
  imports: [CommonModule, RouterLink, WhatWeDoComponent, ContactComponent],
  templateUrl: './services-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesDetailsComponent {}
