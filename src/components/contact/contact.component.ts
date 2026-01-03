import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// GAS WebアプリURL（デプロイ後に設定してください）
const GAS_URL = 'YOUR_GAS_WEB_APP_URL';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class ContactComponent {
  private http = inject(HttpClient);

  contactForm: FormGroup;
  submitted = false;
  submitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.submitted = true;
    this.submitStatus = 'sending';
    this.errorMessage = '';

    // GAS URLが設定されているか確認
    if (GAS_URL === 'YOUR_GAS_WEB_APP_URL') {
      // デモモード：GAS未設定の場合はアラートを表示
      setTimeout(() => {
        this.submitStatus = 'success';
        this.contactForm.reset();
        this.submitted = false;
      }, 1000);
      return;
    }

    // GASにPOSTリクエストを送信
    this.http.post<{ success: boolean; message: string }>(GAS_URL, this.contactForm.value)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.submitStatus = 'success';
            this.contactForm.reset();
          } else {
            this.submitStatus = 'error';
            this.errorMessage = response.message || '送信に失敗しました。';
          }
          this.submitted = false;
        },
        error: (error) => {
          this.submitStatus = 'error';
          this.errorMessage = 'ネットワークエラーが発生しました。しばらく経ってから再度お試しください。';
          this.submitted = false;
          console.error('Form submission error:', error);
        }
      });
  }

  resetStatus() {
    this.submitStatus = 'idle';
    this.errorMessage = '';
  }
}
