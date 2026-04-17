import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';
import { ServicesDetailsComponent } from './components/services-details/services-details.component';

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
  { path: '**', redirectTo: '' }
];
