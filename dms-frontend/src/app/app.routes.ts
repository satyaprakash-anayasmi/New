import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UploadComponent } from './features/upload/upload.component';
import { ReviewComponent } from './features/review/review.component';
import { AssignmentComponent } from './features/assignment/assignment.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'docs/upload', component: UploadComponent },
    { path: 'reviews/pending', component: ReviewComponent },
    { path: 'admin/assign', component: AssignmentComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
