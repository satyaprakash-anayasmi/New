import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoggerService } from '../../core/services/logger.service';

interface Facility {
  id: number;
  name: string;
  hasLink: boolean;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.css'
})
export class FacilitiesComponent implements OnInit {
  facilities: Facility[] = [
    {
      id: 1,
      name: 'Free Grocery',
      hasLink: false,
      icon: 'shopping-cart',
      description: 'Access to basic grocery items at no cost for eligible members.'
    },
    {
      id: 2,
      name: 'All family function grocery and clothes with 0% interest EMI',
      hasLink: true,
      icon: 'gift',
      description: 'Get everything you need for family functions with easy, interest-free EMIs.'
    },
    {
      id: 3,
      name: 'All kitchen items with 0% interest EMI',
      hasLink: true,
      icon: 'coffee',
      description: 'Upgrade your kitchen with modern appliances and items, at zero percent interest.'
    },
    {
      id: 4,
      name: 'My Business',
      hasLink: true,
      icon: 'briefcase',
      description: 'Support and resources to help you start or grow your own business.'
    },
    {
      id: 5,
      name: 'Rural Women’s Development',
      hasLink: true,
      icon: 'users',
      description: 'Empowering women in rural areas through skill development and opportunities.'
    }
  ];

  userProfile: any = null;
  loadingId: number | null = null;
  showSuccessModal: boolean = false;
  successFacilityName: string = '';

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
  }

  onLinkClick(facility: Facility): void {
    if (!this.userProfile) {
      this.toastService.showError('You must be logged in to express interest.');
      return;
    }

    this.loadingId = facility.id;

    const payload = {
      facilityName: facility.name,
      userDetails: this.userProfile
    };

    this.userService.notifyAdminFacilityInterest(payload).subscribe({
      next: () => {
        this.loadingId = null;
        this.successFacilityName = facility.name;
        this.showSuccessModal = true;
        this.toastService.showSuccess(`Interest sent successfully for: ${facility.name}`);
        
        // Auto-close the modal after 4 seconds
        setTimeout(() => {
          this.showSuccessModal = false;
        }, 4000);
      },
      error: (err) => {
        this.loadingId = null;
        this.logger.error('Error sending interest:', err);
        this.toastService.showError('Failed to send notification. Please try again later.');
      }
    });
  }
}
