import { Injectable } from '@angular/core';

/**
 * Google Apps Script (GAS) の Web アプリ URL。
 * gas/contact-form.gs をデプロイして得た URL を設定する。
 */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw0w3YPyax4YpYvUs8uiDPLEoUb6hru7AunTOWaK4RfgEIhdfUFuWaJ7uH0lq6mdBtaPQ/exec';

// GAS 側の処理（バリデーション・レート制限チェック・メール送信）が
// 長引いた場合に「送信中」のまま固まるのを防ぐタイムアウト
const REQUEST_TIMEOUT_MS = 15000;

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
 * ただし GAS の実行が失敗すると script.google.com→script.googleusercontent.com
 * のリダイレクト先で CORS ヘッダーが欠けブラウザ側で fetch が reject される
 * ことがある。その場合は catch 側で「ネットワークエラー」として扱われる。
 */
@Injectable({ providedIn: 'root' })
export class FormSubmitService {
  async submit(payload: Record<string, unknown>): Promise<FormSubmitResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (error) {
      if ((error as { name?: string }).name === 'AbortError') {
        return { success: false, message: 'サーバーの応答がありません。しばらく経ってから再度お試しください。' };
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      return { success: false, message: `サーバーエラーが発生しました (${res.status})。` };
    }

    let data: FormSubmitResult;
    try {
      data = (await res.json()) as FormSubmitResult;
    } catch {
      return { success: false, message: 'サーバーの応答を解析できませんでした。' };
    }

    return { success: data.success === true, message: data.message };
  }
}
