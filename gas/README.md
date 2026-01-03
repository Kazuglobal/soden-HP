# お問い合わせフォーム GAS連携セットアップ

## 概要
お問い合わせフォームをGoogle Apps Script (GAS)と連携し、メール送信を行います。

## セットアップ手順

### Step 1: Google Apps Scriptプロジェクト作成
1. [Google Drive](https://drive.google.com) を開く
2. 「新規」→「その他」→「Google Apps Script」をクリック
3. プロジェクト名を「お問い合わせフォーム」などに変更

### Step 2: コードをコピー
1. `contact-form.gs` の内容を全てコピー
2. GASエディタに貼り付け
3. `RECIPIENT_EMAIL` を実際のメールアドレスに変更:
   ```javascript
   const RECIPIENT_EMAIL = 'your-actual-email@example.com';
   ```

### Step 3: デプロイ
1. 「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で「ウェブアプリ」を選択
3. 設定:
   - 説明: 「お問い合わせフォーム」
   - 次のユーザーとして実行: 「自分」
   - アクセスできるユーザー: 「全員」
4. 「デプロイ」をクリック
5. 表示されたURLをコピー

### Step 4: AngularにURLを設定
`src/components/contact/contact.component.ts` を開き、GAS_URLを更新:
```typescript
const GAS_URL = 'https://script.google.com/macros/s/xxxxx/exec';
```

## テスト
1. http://localhost:3000 でフォームを開く
2. テストデータを入力して送信
3. 設定したメールアドレスにメールが届くことを確認

## トラブルシューティング

### メールが届かない場合
- GASのデプロイURLが正しいか確認
- GASの権限を再確認（初回実行時に権限許可が必要）
- スパムフォルダを確認

### CORSエラーが発生する場合
- GASのデプロイ設定で「アクセスできるユーザー」が「全員」になっているか確認
- GAS URLが `https://script.google.com/macros/s/` で始まっているか確認

## ファイル構成
```
gas/
├── README.md          # このファイル
└── contact-form.gs    # GASスクリプト
```
