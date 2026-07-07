# コードレビュー監査レポート（2026-07-07）

対象: `kazuglobal/soden-hp` main (389c187) 全ファイル精査。
構成: Angular 21 (zoneless / standalone / OnPush) + GSAP + Tailwind Play CDN。SPA + Vercel 配信、問い合わせ/採用フォームは Google Apps Script (GAS) へ POST。SSR なし（`/services` のみビルド後スクリプトで静的 meta 差し替え）。

## 対応状況（本ブランチ `claude/code-review-audit-a6k3vk` で修正済み）

下表の #1〜#20 を全て修正済み。`ng build` / `test:seo`（8件）成功、ヘッドレスブラウザで全5ルート描画・Tailwind適用・フォーム表示を確認。

| # | 対応内容 |
|---|----------|
| 1 | `gas/contact-form.gs` に `type==='entry'` 分岐（`sendEntryEmail`）を追加。全項目を整形送信 |
| 2 | `FormSubmitService` を新設し3フォームを集約。`no-cors` 廃止→GAS応答の `success` を検証。connect-src も GAS 限定に |
| 3 | GAS に入力検証・honeypot(`company_website`)・ScriptProperties によるレート制限を追加。フォームにも隠しhoneypot入力を設置 |
| 4 | custom-cursor を MutationObserver 廃止→`document` へのイベント委譲1組に。ngOnDestroyで解除 |
| 5 | `generate-static-routes.mjs` に company/recruit を追加、`vercel.json` に rewrite 追加 |
| 6 | Tailwind Play CDN → build-time Tailwind v3（CDNと同セマンティクス）。CSPから `unsafe-eval`・CDN・esm.sh 削除、未使用 importmap も除去 |
| 7 | Google Fonts に Caveat / Roboto / Noto Sans JP / Montserrat を追加。未提供の Futura は Montserrat に置換 |
| 8 | header の `href="#contact"` を `[routerLink]="'/'" fragment="contact"` に |
| 9 | `/privacy` ページ・ルート・sitemap 追加。footer のダミーリンクを実リンクに修正 |
| 10 | 画像の immutable キャッシュを `max-age=86400, stale-while-revalidate` に緩和 |
| 11 | 未使用の `smooth-scroll.service.ts` を削除 |
| 12 | `fadeRight/fadeLeft` を `slideRight/slideLeft` に修正。`strictTemplates` を有効化 |
| 13 | gsap-split-text に `destroyed` ガードを追加 |
| 14 | optimize-images の二重エンコードを解消（`writeFile` で直接書き出し） |
| 15 | 未使用 component（staff/members/blog/for-clients）を削除 |
| 16 | `build_error.txt`/`detailed_build_error.txt`・`images/sake/`・`firsuview.JPG` を削除、`.gitignore` に追加 |
| 17 | `@gsap/react`・`vite` を削除、ビルドツールを devDependencies へ移動 |
| 18 | GAS の例外応答を固定文言化（内部情報を返さない） |
| 19 | 各 onSubmit 冒頭に送信中ガードを追加 |
| 20 | mask-reveal の ngOnDestroy で wrapper を unwrap |

> 補足: `what-we-do` の work4 は差し替え用の自社画像が無いため Unsplash のまま残置（要画像手配）。Tailwind は CDN の v3 とクラス名互換を保つため v4 ではなく v3 を採用。

## 発見事項（重要度順・当初レポート）

| # | 重要度 | ファイル:行 | 種別 | 症状・何が起きるか | 原因 | 修正方針 |
|---|--------|------------|------|-------------------|------|----------|
| 1 | **Critical** | `gas/contact-form.gs:49-52` ↔ `src/components/recruit/recruit.component.ts:60-70` / `recruit-details.component.ts:74-84` | 論理バグ / データ喪失 | 採用エントリー送信時、応募者には「送信完了」が表示されるが、会社に届くメールは件名「【お問い合わせ】undefined」・本文の件名/内容も undefined。ふりがな・電話・年齢・志望動機など**エントリー固有フィールドは全て破棄**され応募内容が届かない | フロントは `{type:'entry', name, furigana, email, phone, age, ...}` を送るが、GAS `sendEmail()` は `{name, email, subject, message}` しか読まず `type==='entry'` の分岐が存在しない | GAS 側に entry 分岐を追加し全フィールドを整形してメール化（下記 diff）。※デプロイ済み GAS がリポジトリと異なる可能性あり＝**要確認**だが、リポジトリを正とする限り不整合 |
| 2 | **High** | `src/components/contact/contact.component.ts:42-51`（recruit / recruit-details も同一） | エラーハンドリング / 偽陽性成功 | GAS がエラー（クォータ超過・スクリプト例外・URL失効）でも必ず「送信完了」と表示。error 分岐は物理的なネットワーク断でしか到達しない | `fetch(..., {mode:'no-cors'})` は opaque レスポンスを返し、HTTP 4xx/5xx でも resolve する。GAS が返す `{success:false}` も読めない | GAS Web アプリは `Access-Control-Allow-Origin: *` を返すため `no-cors` を外し、`redirect:'follow'` でレスポンス JSON の `success` を検証して結果表示（下記 diff） |
| 3 | **High** | `gas/contact-form.gs:23-37, 87-109` | セキュリティ | エンドポイントは全公開・無検証。攻撃者が `{email: 被害者, name: スパム文}` を連投すると**会社の Gmail から任意アドレスへ自動返信が送信される**（スパム中継）。Gmail 送信クォータ枯渇で正規の問い合わせも不達に | `doPost` に入力検証・レート制限・honeypot が一切なく、`sendAutoReply` が無条件でユーザー指定アドレスへ送信 | 必須項目/型/長さ/メール形式の検証、honeypot フィールド、CacheService 等での簡易レート制限を追加。`error.toString()` をそのまま返す情報漏えいも修正 |
| 4 | **High** | `src/components/custom-cursor/custom-cursor.component.ts:232-249` | パフォーマンス / リスナーリーク | DOM が変化するたび（メニュー開閉・フォーム表示・ルート遷移・`@for` 更新等）に、ページ内**全ての** `a, button, ...` へ mouseenter/mouseleave リスナーを重複追加。長時間閲覧でリスナーが際限なく蓄積し、ホバー時に gsap.to が N 重実行される | `MutationObserver` のコールバックが毎回 `setupHoverListeners()` を呼び、毎回新しいクロージャを addEventListener（重複判定不能・削除もされない） | `document` への mouseover/mouseout イベント委譲 1 本に置き換える（下記 diff）。少なくとも WeakSet で付与済み要素をスキップ |
| 5 | Medium | `scripts/generate-static-routes.mjs:7-16` + `index.html:37` | SEO / OGP | `/company` `/recruit` を SNS でシェアすると**ホームの OGP**（タイトル・画像）が出る。JS 非実行クローラには canonical が `https://soudenkougyou.com/`（ホーム）と伝わり、重複ページ扱いのリスク | 静的 meta 差し替えは `services` 1 ルートのみ。OGP スクレイパー（LINE/Facebook/X）は JS を実行しないので `app.component.ts` の動的 meta は効かない | `routePages` に company / recruit を追加し（`app.routes.ts` の data と同値）、vercel.json に対応 rewrite を追加 |
| 6 | Medium | `index.html:52` + `vercel.json`(CSP) + `package.json` | パフォーマンス / セキュリティ | 本番で Tailwind **Play CDN**（実行時 JIT）を使用。初回描画遅延・FOUC・CDN 障害で全スタイル喪失。この為だけに CSP へ `unsafe-eval` を許可しており XSS 耐性を大きく毀損 | 開発用 CDN をそのまま本番投入。npm の `tailwindcss` 依存は宣言だけで未使用（config も PostCSS 設定も無い） | Tailwind をビルドパイプラインに統合（`@tailwind` + postcss）し、CDN スクリプトと CSP の `unsafe-eval`・`cdn.tailwindcss.com` を削除 |
| 7 | Medium | `index.html:50` ↔ 各テンプレート | 表示不具合 | `'Caveat'`(5箇所)・`'Roboto'`(4)・`'Noto Sans JP'`(4)・`'Montserrat'`・`'Futura'` を font-family 指定しているが**どれもロードされていない**（読み込みは Noto Serif JP / Dancing Script / Playball のみ）。Contact の手書き風「Contact」等が全て代替フォントで表示される | Google Fonts のリンクにファミリー追加漏れ | fonts.googleapis.com の URL に Caveat / Roboto / Noto Sans JP を追加（Futura は商用フォントなので指定自体を見直し） |
| 8 | Medium | `src/components/header/header.component.html:53, 102`（`<a href="#contact">`） | ルーティング | サブページ（/company 等）で「お問い合わせ」CTA を押すと `<base href="/">` により `/#contact` へ**フルページリロード**。SPA 状態破棄・遅い。/recruit には contact セクションが無いためホームに飛ばされる挙動もユーザーに唐突 | 生の `href="#contact"` は base に対して解決される Angular の典型的落とし穴 | `[routerLink]="'/'" [fragment]="'contact'"` に変更（anchorScrolling は有効化済み） |
| 9 | Medium | `src/components/footer/footer.component.ts:56-61` + フォーム全般 | コンプライアンス | 氏名・メール・年齢・職歴等の個人情報を収集しているのに**プライバシーポリシーページが存在しない**。フッターの「プライバシーポリシー」「サイトマップ」リンクは `/`（ホーム）へのダミー | ページ未実装のままリンクだけ設置 | ポリシーページを追加しリンク先を実装。未実装のうちはリンクを削除 |
| 10 | Medium | `vercel.json`（`/images/(.*)` に `max-age=31536000, immutable`） | キャッシュ不整合 | 画像ファイル名にハッシュが無いため、画像を差し替えても既存訪問者には**最長 1 年**古い画像が表示され続ける | immutable キャッシュ × 非ハッシュファイル名の組み合わせ | 画像は `max-age=86400, stale-while-revalidate` 程度に緩めるか、差し替え時にファイル名を変える運用を徹底 |
| 11 | Medium | `src/services/smooth-scroll.service.ts`（全体・206-207・156-160） | デッドコード内の複合バグ | どこからも使用されていないが、使い始めた瞬間に (a) `removeEventListener('scroll', this.onScroll.bind(this))` は**新しい関数を渡しており解除不能**（リスナーリーク）、(b) `gsap.to(window, {scrollTo})` は `ScrollToPlugin` 未登録のため無反応、の 2 バグを踏む | `.bind()` は毎回別インスタンスを返す / plugin 登録漏れ | 使わないなら削除。使うならハンドラをフィールドに保持して解除、`gsap.registerPlugin(ScrollToPlugin)` を追加 |
| 12 | Low | `src/components/hero/hero.component.html:41,54` / `feature.component.html:14,60` | 型と実データの不整合 | `[animation]="'fadeRight'"` `'fadeLeft'` は `AnimationType` に存在せず、switch の default で **fadeUp にフォールバック**。意図した左右スライド演出になっていない | union 型外の文字列を渡している（strictTemplates 無効のため検出されない） | `slideLeft`/`slideRight` に修正し、tsconfig に `"strictTemplates": true` を追加して再発防止 |
| 13 | Low | `src/directives/gsap-split-text.directive.ts:55-58` | 非同期の取りこぼし | フォントロード前にコンポーネントが破棄されると、`document.fonts.ready.then()` が破棄後に発火して detached 要素に ScrollTrigger を生成（リーク・ngOnDestroy 済みのため kill されない） | destroy フラグ無しで Promise チェーンを継続 | `private destroyed = false` を ngOnDestroy で立て、then 内で早期 return |
| 14 | Low | `scripts/optimize-images.mjs:63-67` | ツール品質 | `pipeline.toBuffer()` で JPEG 化した結果を `sharp(buffer).toFile()` で**再デコード→再エンコード**しており二重に画質劣化。さらに元ファイルを直接上書きする破壊的処理 | 中間バッファの二度書き | `pipeline.toFile(outputPath)` に一本化。可能なら出力先を別ディレクトリに |
| 15 | Low | `src/components/staff/` `members/` `blog/` `for-clients/` | デッドコード | 4 コンポーネントはどこからも参照されない。blog/for-clients は Unsplash・picsum のプレースホルダ画像を含んだまま | 実装途中の残骸 | 削除（必要になったら git 履歴から復元）。使用中の `what-we-do` の work4 も Unsplash ホットリンクで、先方の URL 変更・レート制限で表示が壊れる — 自前ホスティングへ |
| 16 | Low | リポジトリ直下 / `public/images/` | リポジトリ衛生 | `build_error.txt` `detailed_build_error.txt` がコミット済み。`public/images/sake/`（無関係な酒ラベル素材）、`firsuview.JPG`（typo・未使用）、UUID 名 JPG 群など未使用画像多数 → デプロイサイズ肥大 | 掃除漏れ | 未使用アセット削除。`*.txt` エラーログは .gitignore へ |
| 17 | Low | `package.json` | 依存関係 | `@gsap/react`（React 用フック。Angular では無意味）・`vite`・`tailwindcss` が未使用。`@angular/cli`/`@angular/build` が dependencies 側 | 生成時の残骸 | 未使用依存を削除、ビルドツールは devDependencies へ |
| 18 | Low | `gas/contact-form.gs:35` / `42-44` | 情報漏えい（軽微） | 例外時に `error.toString()` をそのまま応答（内部情報の断片が漏れる）。`doGet` が稼働確認用に常時公開 | デバッグ用実装のまま | 固定文言のエラー応答に変更 |
| 19 | Low | `src/components/contact/contact.component.ts:31-34`（recruit 系も） | 冪等性 | `onSubmit` に送信中ガードが無い（ボタン disabled のみで防御）。プログラム的な再入や Enter 連打の際どいケースで二重 POST の余地 | `submitStatus==='sending'` チェック漏れ | 冒頭に `if (this.submitStatus === 'sending') return;` を追加 |
| 20 | Low | `src/directives/mask-reveal.directive.ts:55-67` | 要確認 | `appMaskReveal` は要素を Angular 管理外の wrapper div で包む。対象要素が `*ngIf` 等で破棄されると wrapper とカラーオーバーレイが DOM に残留する可能性 | Renderer で親子関係を組み替えており Angular のビュー破棄と非対称 | ngOnDestroy で wrapper を unwrap する処理を追加（現状の使用箇所では常時表示要素のみのため実害は未確認） |

## スタイル・好みの問題（不具合とは区別）

- **コピペ重複**: `GAS_URL` 定数とエントリーフォームのロジック一式が `contact` / `recruit` / `recruit-details` の 3 箇所に重複。フォーム送信サービスに集約すべき。
- `meta keywords` は主要検索エンジンが無視するため保守コストのみ。
- インライン `style="font-family: ..."` が 50 箇所以上に散在。Tailwind の fontFamily テーマに寄せると一元管理できる。
- `news.component.ts` の日付表記ゆれ（`2026.04.6` — ゼロ埋め無し）。
- ScrollTrigger の参照取得が `ScrollTrigger.getAll().find(...)` — `tween.scrollTrigger` プロパティで直接取れる。
- `tsconfig.json` に `strict` が無く、Angular の `strictTemplates` も無効。#12 のような型ずれが素通りする設定になっている。

## 全体所感

サイトとしての完成度（SEO メタ、構造化データ、アニメーション演出）は高い一方、**フォーム送信経路がほぼ検証されていない**のが最大のリスクです。no-cors による「常に成功表示」が GAS 側の entry 未対応（#1）を覆い隠しており、「応募したのに会社に内容が届かない」が本番で静かに起き得る構造です。また Tailwind Play CDN・esm.sh importmap・React 用依存など AI Studio 生成時の開発用構成が本番にそのまま残っており、CSP の `unsafe-eval` 許可までがその副作用になっています。アニメーション系ディレクティブは総じて丁寧（リスナー解除・ScrollTrigger kill 実装済み）ですが、custom-cursor の MutationObserver（#4）だけは設計レベルの見直しが必要です。

## 今すぐ着手すべき Top 3

1. **GAS スクリプトの entry 対応 + 再デプロイ**（#1）— 採用応募データが現状届いていない可能性。デプロイ済み GAS の実体確認とあわせて最優先。
2. **no-cors をやめ送信結果を正しく判定**（#2）— #1 のような障害を今後検知可能にする土台。3 フォーム共通のサービスに集約して修正。
3. **GAS への入力検証・レート制限追加**（#3）— 会社ドメインの Gmail がスパム送信元にされる前に塞ぐ。

## 修正パッチ例

### #1 GAS: エントリーフォーム対応（`gas/contact-form.gs`）

```diff
 function doPost(e) {
   try {
     const data = JSON.parse(e.postData.contents);
-
-    // メール送信
-    sendEmail(data);
+    if (data.type === 'entry') {
+      sendEntryEmail(data);
+    } else {
+      sendEmail(data);
+    }
     return createResponse({ success: true, message: 'メールを送信しました' });
   } catch (error) {
-    return createResponse({ success: false, message: error.toString() });
+    return createResponse({ success: false, message: '送信処理でエラーが発生しました' });
   }
 }
+
+function sendEntryEmail(data) {
+  const { name, furigana, email, phone, age, education, workHistory,
+          qualifications, startDate, motivation } = data;
+  const body = [
+    '採用エントリーを受け付けました。', '',
+    `■ お名前: ${name}（${furigana}）`,
+    `■ メールアドレス: ${email}`,
+    `■ 電話番号: ${phone}`,
+    `■ 年齢: ${age}`,
+    `■ 学歴: ${education || '未記入'}`,
+    `■ 職歴: ${workHistory || '未記入'}`,
+    `■ 保有資格: ${qualifications || '未記入'}`,
+    `■ 勤務開始可能日: ${startDate || '未記入'}`,
+    '■ 志望動機:', motivation
+  ].join('\n');
+  GmailApp.sendEmail(RECIPIENT_EMAIL, '【採用エントリー】' + name, body,
+    { replyTo: email, name: '採用エントリーフォーム' });
+  sendAutoReply(email, name);
+}
```

### #2 フロント: 送信結果の実判定（`contact.component.ts`、recruit 系 2 箇所も同様）

```diff
   async onSubmit() {
-    if (this.contactForm.invalid) {
+    if (this.contactForm.invalid || this.submitStatus === 'sending') {
       return;
     }
     ...
     try {
-      await fetch(GAS_URL, {
+      const res = await fetch(GAS_URL, {
         method: 'POST',
-        mode: 'no-cors',
         headers: { 'Content-Type': 'text/plain' },
+        redirect: 'follow',
         body: JSON.stringify(this.contactForm.value)
       });
-      this.submitStatus = 'success';
-      this.contactForm.reset();
+      const result = await res.json();
+      if (res.ok && result.success) {
+        this.submitStatus = 'success';
+        this.contactForm.reset();
+      } else {
+        this.submitStatus = 'error';
+        this.errorMessage = '送信に失敗しました。お電話でもお問い合わせいただけます。';
+      }
     } catch (error) {
```

※ GAS Web アプリ（全員アクセス可）は `Access-Control-Allow-Origin: *` を付与するため CORS モードで動作します。デプロイ設定変更時は要動作確認。

### #4 custom-cursor: イベント委譲化（`custom-cursor.component.ts`）

```diff
   private initHoverListeners() {
-    const setupHoverListeners = () => {
-      const interactiveElements = document.querySelectorAll(
-        'a, button, [data-cursor], input[type="submit"], .cursor-hover'
-      );
-      interactiveElements.forEach(el => {
-        el.addEventListener('mouseenter', () => this.handleHoverEnter(el as HTMLElement));
-        el.addEventListener('mouseleave', () => this.handleHoverLeave());
-      });
-    };
-    setupHoverListeners();
-    this.mutationObserver = new MutationObserver(() => {
-      setupHoverListeners();
-    });
-    this.mutationObserver.observe(document.body, { childList: true, subtree: true });
+    const SELECTOR = 'a, button, [data-cursor], input[type="submit"], .cursor-hover';
+    const over = (e: Event) => {
+      const target = (e.target as HTMLElement).closest(SELECTOR);
+      if (target) this.handleHoverEnter(target as HTMLElement);
+    };
+    const out = (e: Event) => {
+      const target = (e.target as HTMLElement).closest(SELECTOR);
+      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
+      if (target && (!related || related.closest(SELECTOR) !== target)) this.handleHoverLeave();
+    };
+    document.addEventListener('mouseover', over);
+    document.addEventListener('mouseout', out);
+    this.delegatedCleanup = () => {
+      document.removeEventListener('mouseover', over);
+      document.removeEventListener('mouseout', out);
+    };
   }
```

（`private delegatedCleanup: (() => void) | null = null;` を追加し、ngOnDestroy で呼び出し。MutationObserver 関連フィールドは削除）

### #12 アニメーション型の修正

```diff
-        [animation]="'fadeRight'" [duration]="1.2">
+        [animation]="'slideRight'" [duration]="1.2">
```
（hero 2 箇所、feature の `'fadeLeft'` は `'slideLeft'` へ）
