import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbw0w3YPyax4YpYvUs8uiDPLEoUb6hru7AunTOWaK4RfgEIhdfUFuWaJ7uH0lq6mdBtaPQ/exec';

interface Employee {
    id: number;
    name: string;
    nameEn: string;
    role: string;
    joined: string;
    school: string;
    hobby: string;
    bloodType: string;
    workDescription: string;
    rewarding: string;
    image: string;
    catchphrase: string;
}

@Component({
    selector: 'app-recruit-details',
    templateUrl: './recruit-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, GsapScrollAnimateDirective]
})
export class RecruitDetailsComponent {
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
    employees: Employee[] = [
        {
            id: 1,
            name: '佐野 英司',
            nameEn: 'Eiji Sano',
            role: '施工管理士、電気工事士、消防設備士',
            joined: '2004年入社',
            school: '青森県立八戸工業高校',
            hobby: 'マウンテンバイク',
            bloodType: 'O型',
            workDescription: '電気科で学んだことを生かしたいと思い入社。現在は住宅10棟など同時進行し、仕事を分配して指示を出しています。難易度の高い1級施工管理技士、第1種電気工事士、自動火災報知設備やガス漏れ火災警報設備などの工事や整備、点検ができる消防設備士甲種4類など国家資格を取得。',
            rewarding: '入社当時、35歳までに取れる資格は取っておきたいと思い、実務経験を積みながら仕事が終わってから勉強しました。竣工のときに、電気がちゃんと点いてモーターがまわっているのを確認できたときは嬉しいですね。みんなパワフルで、すぐに現場に行くフットワークの軽さがあります。',
            image: '/images/employee1.JPG',
            catchphrase: '豊富な資格と経験で、<br>現場を指揮する充実感。'
        },
        {
            id: 2,
            name: '林 隆博',
            nameEn: 'Takahiro Hayashi',
            role: '電気工事士',
            joined: '2014年',
            school: '八戸工業大学第一高校',
            hobby: '三社大祭、八戸えんぶりに毎年参加',
            bloodType: 'AB型',
            workDescription: '建物の基幹設備になる強電工事で、高圧線から使用する電力に降圧する変電設備の設置や、照明、コンセント、各種機械や空調、ポンプ、エレベータなどに電気を送るまでの工事全般をしています。若い子たちが覚えやすい現場環境にして教えながら作業を進めていきます。',
            rewarding: 'もともとは別の業種の仕事をしていましたが、電気に興味がありやってみるとすごく面白く、楽しみながら日々仕事をしています。地震や自然災害などで万が一電気が使えなくなったときは、経験と知識があるので復旧の手助けやアドバイスができると思います。もしもの時は役立てたら嬉しく思います。',
            image: '/images/employee2.JPG',
            catchphrase: '楽しみながら技術を磨き、<br>万が一の時も地域を支える。'
        },
        {
            id: 3,
            name: '榊田 了',
            nameEn: 'Ryoichi Sakakida',
            role: '電気工事士',
            joined: '2013年',
            school: '岩手県立大野高校',
            hobby: 'ゲーム、スポーツ全般、カラオケ',
            bloodType: 'A型',
            workDescription: '内装関係の仕事から転職。資格がありませんでしたが入社して働きながら第2種電気工事士の資格を取り、電気工事全般の仕事をしています。ビルやマンションなど頼まれた仕事は何でもやります。アットホームで仕事がしやすい職場です。家族のためにも頑張っていきたいと思います。',
            rewarding: '電気工事は覚えることがとても多い仕事です。進化しているので常に難しいことを覚えてずっと学ぶ姿勢が必要ですし、それだけやりがいがあり、飽きることが無い仕事だと思います。新しいことにどんどんチャレンジして今後仕事の幅をもっと広げていきたいと思います。',
            image: '/images/employee3.JPG',
            catchphrase: '未経験からプロへ。<br>新しい仕事に挑む面白さ。'
        }
    ];
}
