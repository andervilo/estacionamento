import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="h-screen flex flex-col">
      <mat-toolbar color="primary" class="shadow-lg z-10 relative">
        <button mat-icon-button (click)="sidenav.toggle()" class="mr-2 md:hidden">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="font-bold text-xl flex items-center gap-2">
          <mat-icon>local_parking</mat-icon> ParkFlow
        </span>
        <span class="flex-1"></span>
      </mat-toolbar>

      <mat-sidenav-container class="flex-1 bg-gray-50">
        <mat-sidenav #sidenav mode="side" opened class="w-64 border-r border-gray-200 shadow-sm hidden md:block">
          <mat-nav-list class="pt-4">
            <a mat-list-item routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-600" class="mb-1">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/entrada" routerLinkActive="bg-blue-50 text-blue-600" class="mb-1">
              <mat-icon matListItemIcon>input</mat-icon>
              <span matListItemTitle>Registrar Entrada</span>
            </a>
            <a mat-list-item routerLink="/saida" routerLinkActive="bg-blue-50 text-blue-600" class="mb-1">
              <mat-icon matListItemIcon>output</mat-icon>
              <span matListItemTitle>Registrar Saída</span>
            </a>
            <a mat-list-item routerLink="/faturamento" routerLinkActive="bg-blue-50 text-blue-600" class="mb-1">
              <mat-icon matListItemIcon>attach_money</mat-icon>
              <span matListItemTitle>Faturamento</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="p-4 md:p-8">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    mat-sidenav-container {
      height: 100%;
    }
  `]
})
export class AppComponent {
  title = 'ParkFlow';
}
