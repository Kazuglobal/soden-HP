/**
 * Google Apps Script - お問い合わせフォーム処理
 *
 * 使い方:
 * 1. Google Drive で「新規」→「その他」→「Google Apps Script」を作成
 * 2. このコードをコピー&ペースト
 * 3. RECIPIENT_EMAIL を実際のメールアドレスに変更
 * 4. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択
 * 5. 「アクセスできるユーザー」を「全員」に設定
 * 6. デプロイしてURLをコピー
 * 7. そのURLをAngularのcontact.component.tsに設定
 */

// 送信先メールアドレス（変更してください）
const RECIPIENT_EMAIL = 'your-email@example.com';

// メール件名のプレフィックス
const SUBJECT_PREFIX = '【お問い合わせ】';

/**
 * POSTリクエストを処理
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // メール送信
    sendEmail(data);

    // 成功レスポンス
    return createResponse({ success: true, message: 'メールを送信しました' });

  } catch (error) {
    // エラーレスポンス
    return createResponse({ success: false, message: error.toString() });
  }
}

/**
 * GETリクエストを処理（テスト用）
 */
function doGet(e) {
  return createResponse({ success: true, message: 'GAS is running' });
}

/**
 * メール送信
 */
function sendEmail(data) {
  const { name, email, subject, message } = data;

  const emailSubject = SUBJECT_PREFIX + subject;

  const emailBody = `
お問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お名前
${name}

■ メールアドレス
${email}

■ 件名
${subject}

■ お問い合わせ内容
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは自動送信されています。
`;

  // メール送信
  GmailApp.sendEmail(RECIPIENT_EMAIL, emailSubject, emailBody, {
    replyTo: email,
    name: 'お問い合わせフォーム'
  });

  // 自動返信メール（オプション）
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
 * JSONレスポンス作成（CORS対応）
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
