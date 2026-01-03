import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class CompanyComponent {
  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
