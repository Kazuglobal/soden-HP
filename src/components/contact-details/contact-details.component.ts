import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ContactComponent],
  templateUrl: './contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDetailsComponent {}
