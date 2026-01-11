import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbw0w3YPyax4YpYvUs8uiDPLEoUb6hru7AunTOWaK4RfgEIhdfUFuWaJ7uH0lq6mdBtaPQ/exec';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GsapSplitTextDirective, GsapScrollAnimateDirective],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  submitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  errorMessage = '';

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.submitted = true;
    this.submitStatus = 'sending';
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(this.contactForm.value)
      });
      this.submitStatus = 'success';
      this.contactForm.reset();
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
