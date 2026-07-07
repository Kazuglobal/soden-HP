import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { FormSubmitService } from '../../services/form-submit.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GsapScrollAnimateDirective],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly formSubmit = inject(FormSubmitService);

  contactForm: FormGroup;
  submitted = false;
  submitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  errorMessage = '';
  showForm = false;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      // Honeypot: 通常のユーザーには見えず、ボットだけが入力する隠しフィールド
      company_website: ['']
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid || this.submitStatus === 'sending') {
      return;
    }

    this.submitted = true;
    this.submitStatus = 'sending';
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      const result = await this.formSubmit.submit(this.contactForm.value);
      if (result.success) {
        this.submitStatus = 'success';
        this.contactForm.reset();
      } else {
        this.submitStatus = 'error';
        this.errorMessage = result.message
          || '送信に失敗しました。お手数ですがお電話でもお問い合わせいただけます。';
      }
    } catch (error) {
      this.submitStatus = 'error';
      this.errorMessage = 'ネットワークエラーが発生しました。しばらく経ってから再度お試しください。';
      console.error('Form submission error:', error);
    } finally {
      this.submitted = false;
      this.cdr.markForCheck();
    }
  }

  resetStatus() {
    this.submitStatus = 'idle';
    this.errorMessage = '';
  }
}
