import { Injectable } from '@angular/core';

/**
 * Google Apps Script (GAS) の Web アプリ URL。
 * gas/contact-form.gs をデプロイして得た URL を設定する。
 */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw0w3YPyax4YpYvUs8uiDPLEoUb6hru7AunTOWaK4RfgEIhdfUFuWaJ7uH0lq6mdBtaPQ/exec';

export interface FormSubmitResult {
  success: boolean;
  message?: string;
}

/**
 * お問い合わせ / 採用エントリー共通のフォーム送信サービス。
 *
 * 以前は各コンポーネントで `fetch(..., { mode: 'no-cors' })` していたため、
 * GAS 側がエラーを返しても opaque レスポンスで常に「成功」扱いになっていた。
 * ここでは通常モードで送信し、GAS が返す JSON の `success` を検証して
 * 実際の結果を呼び出し側へ返す。
 *
 * GAS Web アプリ（アクセス権「全員」）のレスポンスは
 * `Access-Control-Allow-Origin: *` を含むため、Content-Type を
 * text/plain（simple request）にすればプリフライト無しで送信できる。
 */
@Injectable({ providedIn: 'root' })
export class FormSubmitService {
  async submit(payload: Record<string, unknown>): Promise<FormSubmitResult> {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { success: false, message: `サーバーエラーが発生しました (${res.status})。` };
    }

    const data = (await res.json()) as FormSubmitResult;
    return { success: data.success === true, message: data.message };
  }
}
