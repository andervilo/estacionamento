import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntryFormComponent } from './components/entry-form/entry-form.component';
import { ExitListComponent } from './components/exit-list/exit-list.component';
import { BillingReportComponent } from './components/billing-report/billing-report.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'entrada', component: EntryFormComponent },
    { path: 'saida', component: ExitListComponent },
    { path: 'faturamento', component: BillingReportComponent }
];
