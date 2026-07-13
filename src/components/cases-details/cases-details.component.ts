import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CasesComponent } from '../cases/cases.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-cases-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CasesComponent, ContactComponent],
  templateUrl: './cases-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CasesDetailsComponent {}
