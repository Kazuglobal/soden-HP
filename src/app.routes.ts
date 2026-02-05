import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: '株式会社SEIKEN | 溶接工事・鉄鋼加工（横浜）',
      description: '横浜を中心に溶接工事を行う株式会社SEIKEN。アーク溶接・半自動溶接・Tig溶接、鍛冶工事・鉄骨工事など鉄鋼のプロフェッショナルとして確かな技術で対応。',
      keywords: 'SEIKEN,溶接工事,アーク溶接,半自動溶接,Tig溶接,鍛冶工事,鉄骨工事,鉄鋼加工,横浜',
      image: '/images/companyinfo.png',
      imageAlt: 'SEIKENのチーム'
    }
  },
  {
    path: 'company',
    component: CompanyDetailsComponent,
    data: {
      title: '会社概要 | 株式会社SEIKEN',
      description: '会社概要・沿革・所在地・事業内容を掲載。横浜を中心に溶接工事・鉄鋼加工を行う株式会社SEIKEN。',
      keywords: '会社概要,企業情報,沿革,所在地,溶接工事,鉄鋼加工,横浜,SEIKEN',
      image: '/images/companyinfo.png',
      imageAlt: '株式会社SEIKENの会社情報'
    }
  },
  {
    path: 'recruit',
    component: RecruitDetailsComponent,
    data: {
      title: '採用情報 | 株式会社SEIKEN',
      description: '採用情報・社員紹介・エントリーフォーム。溶接工・鉄工士の求人を横浜で募集。',
      keywords: '採用情報,求人,溶接工,鉄工士,未経験,横浜,SEIKEN',
      image: '/images/recruit_hero_bright.png',
      imageAlt: 'SEIKENの採用情報'
    }
  },
  { path: '**', redirectTo: '' }
];
