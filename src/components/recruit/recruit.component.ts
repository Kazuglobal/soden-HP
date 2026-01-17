import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbw0w3YPyax4YpYvUs8uiDPLEoUb6hru7AunTOWaK4RfgEIhdfUFuWaJ7uH0lq6mdBtaPQ/exec';

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
    motivation: ['', [Validators.required]]
  });

  toggleEntryForm(): void {
    this.showEntryForm = !this.showEntryForm;
    if (this.showEntryForm) {
      this.resetEntryStatus();
    }
  }

  async onEntrySubmit(): Promise<void> {
    if (this.entryForm.invalid) {
      return;
    }

    this.entrySubmitted = true;
    this.entrySubmitStatus = 'sending';
    this.entryErrorMessage = '';
    this.cdr.markForCheck();

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ type: 'entry', ...this.entryForm.value })
      });

      this.entrySubmitStatus = 'success';
      this.entryForm.reset();
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
