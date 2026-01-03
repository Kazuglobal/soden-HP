import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {}
