import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { FormSubmitService } from '../../services/form-submit.service';

@Component({
  selector: 'app-recruit',
  templateUrl: './recruit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, GsapScrollAnimateDirective]
})
export class RecruitComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly formSubmit = inject(FormSubmitService);

  showEntryForm = false;
  entrySubmitted = false;
  entrySubmitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  entryErrorMessage = '';

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    furigana: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    age: ['', [Validators.required, Validators.min(18)]],
    education: [''],
    workHistory: [''],
    qualifications: [''],
    startDate: [''],
    motivation: ['', [Validators.required]],
    // Honeypot: 通常のユーザーには見えず、ボットだけが入力する隠しフィールド
    company_website: ['']
  });

  toggleEntryForm(): void {
    this.showEntryForm = !this.showEntryForm;
    if (this.showEntryForm) {
      this.resetEntryStatus();
    }
  }

  async onEntrySubmit(): Promise<void> {
    if (this.entryForm.invalid || this.entrySubmitStatus === 'sending') {
      return;
    }

    this.entrySubmitted = true;
    this.entrySubmitStatus = 'sending';
    this.entryErrorMessage = '';
    this.cdr.markForCheck();

    try {
      const result = await this.formSubmit.submit({ type: 'entry', ...this.entryForm.value });
      if (result.success) {
        this.entrySubmitStatus = 'success';
        this.entryForm.reset();
      } else {
        this.entrySubmitStatus = 'error';
        this.entryErrorMessage = result.message
          || '送信に失敗しました。お手数ですがお電話でもお問い合わせください。';
      }
    } catch (error) {
      this.entrySubmitStatus = 'error';
      this.entryErrorMessage = 'ネットワークエラーが発生しました。しばらく経ってから再度お試しください。';
      console.error('Entry form submission error:', error);
    } finally {
      this.entrySubmitted = false;
      this.cdr.markForCheck();
    }
  }

  resetEntryStatus(): void {
    this.entrySubmitStatus = 'idle';
    this.entryErrorMessage = '';
  }
}
