import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';
import { ServicesDetailsComponent } from './components/services-details/services-details.component';
import { CasesDetailsComponent } from './components/cases-details/cases-details.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { AccessDetailsComponent } from './components/access-details/access-details.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: '株式会社創電工業 | 電気設備工事・設計施工（青森県八戸市）',
      description: '青森県八戸市の株式会社創電工業。電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理まで一貫対応。1987年創業、地域密着38年の実績と信頼。まずはお気軽にご相談ください。',
      keywords: '創電工業,電気工事,電気設備工事,電気通信工事,消防設備,空調設備,太陽光発電,物流システム,設計施工,保守管理,八戸市,青森県,電気工事会社,八戸電気工事,青森電気工事,ビル管理,施工管理',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業 チーム集合写真'
    }
  },
  {
    path: 'services',
    component: ServicesDetailsComponent,
    data: {
      title: '事業内容 | 株式会社創電工業（青森県八戸市）',
      description: '株式会社創電工業の事業内容。電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理まで、青森県八戸市を拠点に一貫対応します。',
      keywords: '事業内容,サービス,電気設備工事,電気通信工事,消防設備,空調設備,太陽光発電,物流システム,保守管理,八戸市,青森県,創電工業',
      image: '/images/elct1.jpg',
      imageAlt: '株式会社創電工業の事業内容'
    }
  },
  {
    path: 'company',
    component: CompanyDetailsComponent,
    data: {
      title: '会社概要 | 株式会社創電工業（青森県八戸市）',
      description: '株式会社創電工業の会社概要・沿革・所在地・資格・事業内容。1987年創業、青森県八戸市を拠点に電気設備工事・空調設備・消防設備・物流システムの設計施工から保守管理まで38年の実績。',
      keywords: '会社概要,企業情報,沿革,所在地,電気工事,電気設備工事,八戸市,青森県,創電工業,代表取締役,資本金,従業員数,許可番号',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業の会社情報'
    }
  },
  {
    path: 'recruit',
    component: RecruitDetailsComponent,
    data: {
      title: '採用情報 | 株式会社創電工業（青森県八戸市）',
      description: '株式会社創電工業の採用情報。電気工事士・施工管理技士・未経験者歓迎。青森県八戸市の安定した電気設備工事会社で一緒に働きませんか。福利厚生充実・資格取得支援あり。',
      keywords: '採用情報,求人,電気工事士,施工管理技士,電気工事会社求人,未経験歓迎,八戸市求人,青森県求人,創電工業採用,転職,新卒,第二種電気工事士,第一種電気工事士',
      image: '/images/recruit_hero_bright.jpg',
      imageAlt: '株式会社創電工業 採用情報'
    }
  },
  {
    path: 'cases',
    component: CasesDetailsComponent,
    data: {
      title: '施工事例｜株式会社創電工業（青森県八戸市の電気設備工事）',
      description: '青森県八戸市の株式会社創電工業による電気設備工事・電気通信工事・太陽光発電設備の施工事例をご紹介。公共施設から民間ビル、個人住宅まで、八戸市・三沢市など県南地域での実績と技術力をご覧いただけます。',
      keywords: '施工事例,施工実績,電気工事,電気設備工事,太陽光発電,八戸市,青森県,創電工業,公共工事,ビル電気工事,八戸 電気工事',
      image: '/images/building.jpg',
      imageAlt: '株式会社創電工業の施工事例'
    }
  },
  {
    path: 'contact',
    component: ContactDetailsComponent,
    data: {
      title: 'お問い合わせ｜株式会社創電工業（青森県八戸市の電気設備工事）',
      description: '電気設備工事・電気通信工事・太陽光発電設備のご相談やお見積りは、青森県八戸市の株式会社創電工業までお気軽にお問い合わせください。電話番号0178-25-2172、平日8:00-18:00受付。',
      keywords: 'お問い合わせ,電気工事 見積もり,八戸 電気工事,電気工事 相談,創電工業,八戸市,青森県',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業へのお問い合わせ'
    }
  },
  {
    path: 'access',
    component: AccessDetailsComponent,
    data: {
      title: 'アクセス｜株式会社創電工業（青森県八戸市の電気設備工事会社）',
      description: '株式会社創電工業の所在地・地図・アクセス情報。青森県八戸市大字大久保字小久保平19-7、TEL 0178-25-2172。八戸市・三沢市・おいらせ町など県南地域の電気工事に対応しています。',
      keywords: 'アクセス,所在地,地図,創電工業,八戸市,青森県,電気工事会社',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業の所在地'
    }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      title: 'プライバシーポリシー | 株式会社創電工業（青森県八戸市）',
      description: '株式会社創電工業のプライバシーポリシー。お問い合わせフォーム・採用エントリーフォームで取得する個人情報の取り扱い方針についてご説明します。',
      keywords: 'プライバシーポリシー,個人情報保護方針,創電工業,八戸市,青森県',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業'
    }
  },
  { path: '**', redirectTo: '' }
];
