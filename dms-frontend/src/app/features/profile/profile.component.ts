import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService, ProfileData } from '../../core/services/profile.service';
import { PaymentService, PaymentRecord } from '../../core/services/payment.service';
import { ToastService } from '../../core/services/toast.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { AppSelectComponent } from '../../shared/components/app-select/app-select.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppSelectComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile: ProfileData | null = null;
  paymentRecord: PaymentRecord | null = null;
  isLoading = true;
  isLoadingPayment = false;
  isEditing = false;
  isSaving = false;

  get isUserPaid(): boolean { return this.profile?.paymentStatus === 'COMPLETED'; }
  get isPaymentPending(): boolean { return this.profile?.paymentStatus === 'PENDING'; }
  get isPaymentRejected(): boolean { return this.profile?.paymentStatus === 'REJECTED'; }
  get hasNoPayment(): boolean { return !this.profile?.paymentStatus; }

  goToPayment(): void {
    this.router.navigate(['/dashboard/payment']);
  }

  editData = {
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    state: '',
    village: '',
    landmark: '',
    district: '',
    country: '',
    block: '',
    town: '',
    pinCode: '',
    zone: ''
  };

  genders: { id: string, name: string }[] = [];
  zones: { id: number | string, name: string }[] = [];
  countries: { id: number, name: string }[] = [];
  states: { id: number, name: string }[] = [];
  districts: { id: number, name: string }[] = [];
  blocks: { id: number, name: string }[] = [];
  towns: { id: number, name: string }[] = [];
  villages: { id: number, name: string }[] = [];

  unfilteredZones: any[] = [];
  unfilteredCountries: any[] = [];
  unfilteredStates: any[] = [];
  unfilteredDistricts: any[] = [];
  unfilteredBlocks: any[] = [];
  unfilteredTowns: any[] = [];
  unfilteredVillages: any[] = [];

  selectedZoneId: number | string | null = null;
  selectedCountryId: number | null = null;
  selectedStateId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedBlockId: number | null = null;
  selectedTownId: number | null = null;
  selectedVillageId: number | null = null;

  selectedPhoto: File | null = null;
  photoPreviewUrl: string | null = null;

  constructor(
    private readonly profileService: ProfileService,
    private readonly paymentService: PaymentService,
    private readonly toastService: ToastService,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadDropdownOptions();
  }

  loadDropdownOptions(): void {
    this.apiService.getDropdownOptions('GENDER').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.genders = res.data.map((item: any) => ({ id: item.name, name: item.name }));
        }
      }
    });

    const categories = ['COUNTRY', 'STATE', 'DISTRICT', 'SUB_DISTRICT', 'BLOCK'];
    let loadedCount = 0;
    categories.forEach(cat => {
      this.apiService.getDropdownOptions(cat).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const mapped = res.data.map((item: any) => ({
              id: item.id,
              name: item.displayName || item.name,
              parentId: item.parentId || null
            }));

            if (cat === 'COUNTRY') { this.unfilteredCountries = mapped; this.countries = [...mapped]; }
            if (cat === 'STATE') { this.unfilteredStates = mapped; this.states = [...mapped]; }
            if (cat === 'DISTRICT') { this.unfilteredDistricts = mapped; this.districts = [...mapped]; }
            if (cat === 'SUB_DISTRICT') { this.unfilteredTowns = mapped; this.towns = [...mapped]; }
            if (cat === 'BLOCK') { this.unfilteredBlocks = mapped; this.blocks = [...mapped]; }
          }
          loadedCount++;
          if (loadedCount === categories.length) {
            this.initGeoCascade();
          }
        }
      });
    });
  }

  initGeoCascade(): void {
    const lists: Record<string, any[]> = {
      country: this.unfilteredCountries,
      state: this.unfilteredStates,
      district: this.unfilteredDistricts,
      town: this.unfilteredTowns,
      block: this.unfilteredBlocks,
      village: this.unfilteredVillages
    };

    const getMatchId = (key: string, nameValue: string): any => {
      if (!nameValue) return null;
      const match = lists[key].find((item: any) => item.name.toLowerCase() === nameValue.toLowerCase());
      return match ? match.id : nameValue;
    };

    // Populate selected IDs
    this.selectedCountryId = getMatchId('country', this.editData.country);
    this.selectedStateId = getMatchId('state', this.editData.state);
    this.selectedDistrictId = getMatchId('district', this.editData.district);
    this.selectedTownId = getMatchId('town', this.editData.town);
    this.selectedBlockId = getMatchId('block', this.editData.block);
    this.selectedVillageId = getMatchId('village', this.editData.village);

    // Initial fetch of villages if block is selected
    if (this.selectedBlockId && typeof this.selectedBlockId === 'number') {
      this.apiService.getDropdownOptions('VILLAGE', this.selectedBlockId).subscribe(res => {
        if (res.success && res.data) {
          const mapped = res.data.map((item: any) => ({
            id: item.id,
            name: item.displayName || item.name,
            parentId: item.parentId || null
          }));
          this.unfilteredVillages = mapped;
          this.villages = [...mapped];
          
          // Try to match village ID again now that we have the list
          const vMatch = mapped.find((item: any) => item.name.toLowerCase() === (this.editData.village || '').toLowerCase());
          this.selectedVillageId = vMatch ? vMatch.id : this.editData.village;
          this.filterProfileCascade();
        }
      });
    }

    this.filterProfileCascade();
  }

  filterProfileCascade(): void {
    const hierarchy = ['country', 'state', 'district', 'town', 'block', 'village'];
    
    // 1. BACKWARD traverse
    const selectedIds: Record<string, any> = {
      country: this.selectedCountryId,
      state: this.selectedStateId,
      district: this.selectedDistrictId,
      town: this.selectedTownId,
      block: this.selectedBlockId,
      village: this.selectedVillageId
    };

    const lists: Record<string, any[]> = {
      country: this.unfilteredCountries,
      state: this.unfilteredStates,
      district: this.unfilteredDistricts,
      town: this.unfilteredTowns,
      block: this.unfilteredBlocks,
      village: this.unfilteredVillages
    };

    for (let i = hierarchy.length - 1; i > 0; i--) {
      const childKey = hierarchy[i];
      const parentKey = hierarchy[i - 1];
      const childVal = selectedIds[childKey];

      if (childVal) {
        const childItem = lists[childKey].find((item: any) => item.id === childVal);
        if (childItem && childItem.parentId) {
          selectedIds[parentKey] = childItem.parentId;
        }
      }
    }

    this.selectedCountryId = selectedIds['country'];
    this.selectedStateId = selectedIds['state'];
    this.selectedDistrictId = selectedIds['district'];
    this.selectedTownId = selectedIds['town'];
    this.selectedBlockId = selectedIds['block'];
    this.selectedVillageId = selectedIds['village'];

    const getDisplayName = (key: string, id: any): string => {
      if (!id) return '';
      if (typeof id === 'string') return id;
      const item = lists[key].find((o: any) => String(o.id) === String(id));
      return item ? item.name : '';
    };

    this.editData.country = getDisplayName('country', this.selectedCountryId);
    this.editData.state = getDisplayName('state', this.selectedStateId);
    this.editData.district = getDisplayName('district', this.selectedDistrictId);
    this.editData.town = getDisplayName('town', this.selectedTownId);
    this.editData.block = getDisplayName('block', this.selectedBlockId);
    this.editData.village = getDisplayName('village', this.selectedVillageId);

    // 2. FORWARD traverse
    this.countries = [...this.unfilteredCountries];
    this.states = [...this.unfilteredStates];
    this.districts = [...this.unfilteredDistricts];
    this.towns = [...this.unfilteredTowns];
    this.blocks = [...this.unfilteredBlocks];
    this.villages = [...this.unfilteredVillages];

    const currentLists: Record<string, any[]> = {
      country: this.countries,
      state: this.states,
      district: this.districts,
      town: this.towns,
      block: this.blocks,
      village: this.villages
    };

    for (let i = 0; i < hierarchy.length; i++) {
      const currentKey = hierarchy[i];
      const currentValue = selectedIds[currentKey];

      if (currentValue) {
        let activeParentIds = [currentValue];

        for (let j = i + 1; j < hierarchy.length; j++) {
          const childKey = hierarchy[j];
          const fullChildList = lists[childKey];
          
          const filtered = fullChildList.filter((item: any) => 
            item.parentId && activeParentIds.includes(item.parentId)
          );
          currentLists[childKey].length = 0;
          filtered.forEach((f: any) => currentLists[childKey].push(f));
          
          activeParentIds = filtered.map((c: any) => c.id);
        }
      }
    }
  }

  onCountryChange(countryId: any): void {
    this.selectedCountryId = countryId || null;
    if (!countryId) {
      this.selectedStateId = null;
      this.selectedDistrictId = null;
      this.selectedTownId = null;
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterProfileCascade();
  }

  onStateChange(stateId: any): void {
    this.selectedStateId = stateId || null;
    if (!stateId) {
      this.selectedDistrictId = null;
      this.selectedTownId = null;
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterProfileCascade();
  }

  onDistrictChange(districtId: any): void {
    this.selectedDistrictId = districtId || null;
    if (!districtId) {
      this.selectedTownId = null;
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterProfileCascade();
  }

  onTownChange(townId: any): void {
    this.selectedTownId = townId || null;
    if (!townId) {
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterProfileCascade();
  }

  onBlockChange(blockId: any): void {
    this.selectedBlockId = blockId || null;
    if (!blockId) {
      this.selectedVillageId = null;
    }
    
    // Dynamically fetch villages for this block
    if (blockId) {
      this.apiService.getDropdownOptions('VILLAGE', Number(blockId)).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const mapped = res.data.map((item: any) => ({
              id: item.id,
              name: item.displayName || item.name,
              parentId: item.parentId || null
            }));
            this.unfilteredVillages = mapped;
            this.villages = [...mapped];
          }
        }
      });
    } else {
      this.unfilteredVillages = [];
      this.villages = [];
    }
    
    this.filterProfileCascade();
  }

  onVillageChange(villageId: any): void {
    this.selectedVillageId = villageId || null;
    this.filterProfileCascade();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.profile = res.data;
          this.populateEditData();
          this.initGeoCascade();
          if (!this.profile?.isActive) {
            this.loadPaymentRecord();
          }
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadPaymentRecord(): void {
    this.isLoadingPayment = true;
    this.paymentService.getMyPayment().subscribe({
      next: (res) => {
        this.isLoadingPayment = false;
        if (res.success && res.data) {
          this.paymentRecord = res.data;
        } else {
          this.paymentRecord = null;
        }
      },
      error: () => {
        this.isLoadingPayment = false;
        this.paymentRecord = null;
      }
    });
  }

  populateEditData(): void {
    if (!this.profile) return;
    this.editData.fullName = this.profile.fullName || '';
    this.editData.gender = this.profile.gender || '';
    this.editData.dateOfBirth = this.profile.dateOfBirth
      ? this.profile.dateOfBirth.split('T')[0]
      : '';
    this.editData.address = this.profile.address || '';
    this.editData.state = this.profile.state || '';
    this.editData.village = this.profile.village || '';
    this.editData.landmark = this.profile.landmark || '';
    this.editData.district = this.profile.district || '';
    this.editData.country = this.profile.country || '';
    this.editData.block = this.profile.block || '';
    this.editData.town = this.profile.town || '';
    this.editData.pinCode = this.profile.pinCode || '';
    this.editData.zone = this.profile.zone || '';
  }

  startEditing(): void {
    this.isEditing = true;
    this.populateEditData();
    this.initGeoCascade();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.selectedPhoto = null;
    this.photoPreviewUrl = null;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    
    const formData = new FormData();
    if (this.editData.fullName) formData.append('fullName', this.editData.fullName);
    if (this.editData.gender) formData.append('gender', this.editData.gender);
    if (this.editData.dateOfBirth) formData.append('dateOfBirth', this.editData.dateOfBirth);
    if (this.editData.address) formData.append('address', this.editData.address);
    if (this.editData.state) formData.append('state', this.editData.state);
    if (this.editData.village) formData.append('village', this.editData.village);
    if (this.editData.landmark) formData.append('landmark', this.editData.landmark);
    if (this.editData.district) formData.append('district', this.editData.district);
    if (this.editData.country) formData.append('country', this.editData.country);
    if (this.editData.block) formData.append('block', this.editData.block);
    if (this.editData.town) formData.append('town', this.editData.town);
    if (this.editData.pinCode) formData.append('pinCode', this.editData.pinCode);
    if (this.editData.zone) formData.append('zone', this.editData.zone);
    
    if (this.selectedPhoto) {
      formData.append('photo', this.selectedPhoto);
    }

    this.profileService.updateProfile(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.isSaving = false;
          this.isEditing = false;
          this.selectedPhoto = null;
          this.photoPreviewUrl = null;
          this.toastService.showSuccess('Profile updated successfully');
          this.loadDropdownOptions();
          this.loadProfile();
        } else {
          this.isSaving = false;
          this.toastService.showError(res.message || 'Failed to update profile');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastService.showError('An error occurred while saving profile');
      }
    });
  }


  get initials(): string {
    if (!this.profile?.fullName) return 'U';
    const names = this.profile.fullName.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return names[0].substring(0, 2).toUpperCase();
  }

  get formattedJoinDate(): string {
    if (!this.profile?.createdAt) return '—';
    return new Date(this.profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  get formattedDob(): string {
    if (!this.profile?.dateOfBirth) return '—';
    return new Date(this.profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.isEditing = false;
      this.selectedPhoto = null;
      this.photoPreviewUrl = null;
    } else {
      this.isEditing = true;
      this.initGeoCascade();
    }
  }

  copyReferralCode(code?: string): void {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      this.toastService.showSuccess('Referral code copied to clipboard');
    });
  }

  generateReferralCode(): void {
    this.profileService.generateReferralCode().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
          this.toastService.showSuccess('Referral code generated successfully');
        } else {
          this.toastService.showError(res.message || 'Failed to generate referral code');
        }
      },
      error: () => this.toastService.showError('Failed to generate referral code')
    });
  }

}
