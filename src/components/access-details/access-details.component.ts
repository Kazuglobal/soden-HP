import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-access-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ContactComponent],
  templateUrl: './access-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDetailsComponent {
  serviceAreas = ['八戸市', '三沢市', 'おいらせ町', '南部町', '五戸町'];
}
