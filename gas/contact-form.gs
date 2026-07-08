/**
 * Google Apps Script - お問い合わせ / 採用エントリーフォーム処理
 *
 * 使い方:
 * 1. Google Drive で「新規」→「その他」→「Google Apps Script」を作成
 * 2. このコードをコピー&ペースト
 * 3. RECIPIENT_EMAIL を実際のメールアドレスに変更
 * 4. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択
 * 5. 「次のユーザーとして実行」を「自分」、「アクセスできるユーザー」を「全員」に設定
 * 6. デプロイしてURLをコピー
 * 7. そのURLを src/services/form-submit.service.ts の GAS_URL に設定
 *
 * 仕様:
 * - お問い合わせ: { name, email, subject, message }
 * - 採用エントリー: { type: 'entry', name, furigana, email, phone, age, ... }
 *   → data.type === 'entry' で分岐して整形
 */

// 送信先メールアドレス
const RECIPIENT_EMAIL = 'soudennkougyou@mpd.biglobe.ne.jp';

// メール件名のプレフィックス
const SUBJECT_PREFIX = '【お問い合わせ】';
const ENTRY_SUBJECT_PREFIX = '【採用エントリー】';

// 各フィールドの最大長（DoS / 巨大ペイロード対策）
const MAX_FIELD_LENGTH = 5000;

// 同一送信元からの最短送信間隔（ミリ秒）。簡易レート制限
const RATE_LIMIT_MS = 10 * 1000;

/**
 * POSTリクエストを処理
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse({ success: false, message: 'リクエストが不正です。' });
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createResponse({ success: false, message: 'リクエストの形式が不正です。' });
    }

    // Honeypot: ボットが埋めやすい隠しフィールドに値があれば無言で成功扱い
    if (data.company_website) {
      return createResponse({ success: true, message: '受け付けました。' });
    }

    // 送信者ごとのレート制限キー（メールアドレス基準）。
    // グローバル単一キーだと無関係な訪問者同士が誤ってブロックし合うため、
    // 送信者を識別できる値でバケットを分ける
    const rateLimitKey = normalizeRateLimitKey(data.email);

    // 簡易レート制限（バリデーション前にチェックするが、時刻の記録は
    // 実際に送信できた場合のみ行う。バリデーション失敗で時刻を記録すると
    // 直後の正しい再送まで誤ってブロックしてしまうため）
    if (isRateLimited(rateLimitKey)) {
      return createResponse({
        success: false,
        message: '送信間隔が短すぎます。しばらく経ってから再度お試しください。'
      });
    }

    if (data.type === 'entry') {
      const errors = validateEntry(data);
      if (errors.length > 0) {
        return createResponse({ success: false, message: errors.join(' ') });
      }
      sendEntryEmail(data);
    } else {
      const errors = validateContact(data);
      if (errors.length > 0) {
        return createResponse({ success: false, message: errors.join(' ') });
      }
      sendEmail(data);
    }

    markSubmitted(rateLimitKey);
    return createResponse({ success: true, message: 'メールを送信しました' });

  } catch (error) {
    // 内部情報を漏らさないよう固定文言で応答（詳細はログに残す）
    console.error('doPost error:', error);
    return createResponse({ success: false, message: '送信処理でエラーが発生しました。' });
  }
}

/**
 * GETリクエストを処理（ヘルスチェック用）
 */
function doGet() {
  return createResponse({ success: true, message: 'GAS is running' });
}

/**
 * メールアドレスの簡易形式チェック
 */
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * 値が非空文字列で、かつ最大長以内か
 */
function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_FIELD_LENGTH;
}

/**
 * お問い合わせフォームの入力検証
 */
function validateContact(data) {
  const errors = [];
  if (!isFilled(data.name)) errors.push('お名前が未入力です。');
  if (!isValidEmail(data.email)) errors.push('メールアドレスが不正です。');
  if (!isFilled(data.subject)) errors.push('件名が未入力です。');
  if (!isFilled(data.message)) errors.push('お問い合わせ内容が未入力です。');
  return errors;
}

/**
 * 採用エントリーフォームの入力検証
 */
function validateEntry(data) {
  const errors = [];
  if (!isFilled(data.name)) errors.push('お名前が未入力です。');
  if (!isFilled(data.furigana)) errors.push('ふりがなが未入力です。');
  if (!isValidEmail(data.email)) errors.push('メールアドレスが不正です。');
  if (!isFilled(data.phone)) errors.push('電話番号が未入力です。');
  if (!isValidAge(data.age)) errors.push('年齢が不正です。');
  if (!isFilled(data.motivation)) errors.push('志望動機が未入力です。');
  return errors;
}

/**
 * 年齢が18以上の整数（文字列可）かどうか
 */
function isValidAge(age) {
  if (age === undefined || age === null || age === '') return false;
  const n = Number(age);
  return Number.isFinite(n) && n >= 18 && Number.isInteger(n);
}

/**
 * お問い合わせメール送信
 */
function sendEmail(data) {
  const { name, email, subject, message } = data;

  const emailSubject = SUBJECT_PREFIX + subject;

  const emailBody = [
    'お問い合わせを受け付けました。',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '■ お名前',
    name,
    '',
    '■ メールアドレス',
    email,
    '',
    '■ 件名',
    subject,
    '',
    '■ お問い合わせ内容',
    message,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'このメールは自動送信されています。'
  ].join('\n');

  GmailApp.sendEmail(RECIPIENT_EMAIL, emailSubject, emailBody, {
    replyTo: email,
    name: 'お問い合わせフォーム'
  });

  sendAutoReply(email, name);
}

/**
 * 採用エントリーメール送信
 */
function sendEntryEmail(data) {
  const {
    name, furigana, email, phone, age,
    education, workHistory, qualifications, startDate, motivation
  } = data;

  const emailSubject = ENTRY_SUBJECT_PREFIX + name;

  const emailBody = [
    '採用エントリーを受け付けました。',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `■ お名前: ${name}（${furigana}）`,
    `■ メールアドレス: ${email}`,
    `■ 電話番号: ${phone}`,
    `■ 年齢: ${age === undefined || age === null || age === '' ? '未記入' : age}`,
    `■ 学歴: ${education || '未記入'}`,
    `■ 職歴: ${workHistory || '未記入'}`,
    `■ 保有資格: ${qualifications || '未記入'}`,
    `■ 勤務開始可能日: ${startDate || '未記入'}`,
    '',
    '■ 志望動機',
    motivation,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'このメールは自動送信されています。'
  ].join('\n');

  GmailApp.sendEmail(RECIPIENT_EMAIL, emailSubject, emailBody, {
    replyTo: email,
    name: '採用エントリーフォーム'
  });

  sendAutoReply(email, name);
}

/**
 * 自動返信メール送信
 */
function sendAutoReply(email, name) {
  const subject = '【自動返信】お問い合わせありがとうございます';

  const body = `
${name} 様

この度はお問い合わせいただき、誠にありがとうございます。

お問い合わせ内容を確認の上、担当者より折り返しご連絡いたします。
通常、2〜3営業日以内にご返信いたしますので、しばらくお待ちください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
創電工業株式会社
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※このメールは自動送信されています。
※このメールに返信されても対応できませんのでご了承ください。
`;

  GmailApp.sendEmail(email, subject, body, {
    name: '創電工業株式会社'
  });
}

/**
 * レート制限のバケットキーを作る。
 * GAS は送信元IPを取得できないため、送信者が入力したメールアドレスを
 * 識別子として使う（大文字小文字・前後空白を正規化）。メール未入力/不正な
 * 場合は共有の 'anonymous' バケットにまとめる（バリデーションで別途弾かれる）。
 */
function normalizeRateLimitKey(email) {
  if (typeof email === 'string' && email.trim()) {
    return 'rl_' + email.trim().toLowerCase();
  }
  return 'rl_anonymous';
}

/**
 * 簡易レート制限。
 * ScriptProperties にキーごとの最終送信時刻を記録し、RATE_LIMIT_MS 未満なら
 * 拒否する。時刻の記録自体は行わない（呼び出し側が実際に送信できた場合のみ
 * markSubmitted() で記録する）。
 * @returns {boolean} 制限に掛かっていれば true
 */
function isRateLimited(key) {
  try {
    const props = PropertiesService.getScriptProperties();
    const now = Date.now();
    const last = Number(props.getProperty(key) || 0);
    return !!(last && now - last < RATE_LIMIT_MS);
  } catch (err) {
    // レート制限の失敗で送信自体を止めない
    console.error('rate limit error:', err);
    return false;
  }
}

/**
 * 送信成功後にレート制限の時刻を記録する
 */
function markSubmitted(key) {
  try {
    PropertiesService.getScriptProperties().setProperty(key, String(Date.now()));
  } catch (err) {
    console.error('rate limit mark error:', err);
  }
}

/**
 * JSONレスポンス作成
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
