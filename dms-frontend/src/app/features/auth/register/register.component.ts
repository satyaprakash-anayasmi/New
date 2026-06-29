import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ApiService } from '../../../core/services/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { AppSelectComponent } from '../../../shared/components/app-select/app-select.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';

type Step = 'METHOD' | 'OTP' | 'DETAILS' | 'PAYMENT';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, AppSelectComponent, FileUploadComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {

  step: Step = 'METHOD';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  // Registration method choice
  regMethod: 'EMAIL' | 'PHONE' = 'EMAIL';

  // Form fields
  userData = {
    identifier: '',      // email or phone depending on regMethod
    secondaryIdentifier: '', // the other one (phone if email, email if phone)
    username: '',
    password: '',
    confirmPassword: '',
    otpCode: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    block: '',
    town: '',
    state: '',
    village: '',
    landmark: '',
    district: '',
    country: '',
    pinCode: '',
    promoCode: '',       // referral / promo code
    zone: '',            // selected zone
    requestedRole: 'ROLE_UPLOADER',
    photoUrl: ''
  };

  promoCodeStatus: 'idle' | 'valid' | 'invalid' | 'checking' = 'idle';
  promoCodeMessage = '';

  genders: any[] = [];
  zones: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  districts: any[] = [];
  blocks: any[] = [];
  villages: any[] = [];
  towns: any[] = [];

  unfilteredZones: any[] = [];
  unfilteredCountries: any[] = [];
  unfilteredStates: any[] = [];
  unfilteredDistricts: any[] = [];
  unfilteredBlocks: any[] = [];
  unfilteredTowns: any[] = [];
  unfilteredVillages: any[] = [];

  // Parallel ID state for dependent dropdowns
  selectedZoneId: number | null = null;
  selectedCountryId: number | null = null;
  selectedStateId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedBlockId: number | null = null;
  selectedTownId: number | null = null;
  selectedVillageId: number | null = null;

  // Photo upload
  selectedPhoto: File | null = null;
  photoPreviewUrl: string | null = null;

  // OTP countdown
  otpTimer = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // Payment choice
  paymentChoice: 'NOW' | 'SKIP' = 'SKIP';

  // Referral highlight (when coming from welcome page via ?ref=1)
  highlightReferral = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDropdownOptions();
    // If navigated with ?ref=1 (from "By Referral" button on welcome page),
    // set the flag so the promo code field is highlighted in Step 3
    this.route.queryParams.subscribe(params => {
      if (params['ref']) {
        this.highlightReferral = true;
      }
    });
  }

  loadDropdownOptions(): void {
    this.apiService.getDropdownOptions('GENDER').subscribe(res => {
      if (res.success && res.data) {
        this.genders = res.data.map((item: any) => ({ id: item.name, name: item.name }));
      }
    });

    const categories = ['COUNTRY', 'STATE', 'DISTRICT', 'SUB_DISTRICT', 'BLOCK'];
    categories.forEach(cat => {
      this.apiService.getDropdownOptions(cat).subscribe(res => {
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
      });
    });
  }

  filterRegCascade(): void {
    const hierarchy = ['country', 'state', 'district', 'town', 'block', 'village'];
    
    // 1. BACKWARD traverse (child selects parent automatically)
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

    // Backward loop
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

    // Sync selected IDs back
    this.selectedCountryId = selectedIds['country'];
    this.selectedStateId = selectedIds['state'];
    this.selectedDistrictId = selectedIds['district'];
    this.selectedTownId = selectedIds['town'];
    this.selectedBlockId = selectedIds['block'];
    this.selectedVillageId = selectedIds['village'];

    // Update string display values in userData
    const getDisplayName = (key: string, id: any): string => {
      if (!id) return '';
      if (typeof id === 'string') return id;
      const item = lists[key].find((o: any) => o.id === id);
      return item ? item.name : '';
    };

    this.userData.country = getDisplayName('country', this.selectedCountryId);
    this.userData.state = getDisplayName('state', this.selectedStateId);
    this.userData.district = getDisplayName('district', this.selectedDistrictId);
    this.userData.town = getDisplayName('town', this.selectedTownId);
    this.userData.block = getDisplayName('block', this.selectedBlockId);
    this.userData.village = getDisplayName('village', this.selectedVillageId);

    // 2. FORWARD traverse (parent filters children lists)
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
    this.filterRegCascade();
  }

  onStateChange(stateId: any): void {
    this.selectedStateId = stateId || null;
    if (!stateId) {
      this.selectedDistrictId = null;
      this.selectedTownId = null;
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterRegCascade();
  }

  onDistrictChange(districtId: any): void {
    this.selectedDistrictId = districtId || null;
    if (!districtId) {
      this.selectedTownId = null;
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterRegCascade();
  }

  onTownChange(townId: any): void {
    this.selectedTownId = townId || null;
    if (!townId) {
      this.selectedBlockId = null;
      this.selectedVillageId = null;
    }
    this.filterRegCascade();
  }

  onBlockChange(blockId: any): void {
    this.selectedBlockId = blockId || null;
    if (!blockId) {
      this.selectedVillageId = null;
    }

    if (blockId) {
      this.apiService.getDropdownOptions('VILLAGE', Number(blockId)).subscribe(res => {
        if (res.success && res.data) {
          const mapped = res.data.map((item: any) => ({
            id: item.id,
            name: item.displayName || item.name,
            parentId: item.parentId || null
          }));
          this.unfilteredVillages = mapped;
          this.villages = [...mapped];
        }
      });
    } else {
      this.unfilteredVillages = [];
      this.villages = [];
    }

    this.filterRegCascade();
  }

  onVillageChange(villageId: any): void {
    this.selectedVillageId = villageId || null;
    this.filterRegCascade();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  // ─── Step 1: Send OTP ────────────────────────────────────────────────────
  sendOtp(): void {
    const id = this.userData.identifier.trim();
    if (!id) {
      this.toastService.showError(
        this.regMethod === 'EMAIL' ? 'Please enter a valid email address' : 'Please enter a valid phone number');
      return;
    }
    if (this.regMethod === 'EMAIL' && !id.includes('@')) {
      this.toastService.showError('Please enter a valid email address');
      return;
    }
    this.isLoading = true;
    this.authService.sendRegisterOtp(id, this.regMethod).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 'OTP';
        this.startOtpTimer(120);
        this.toastService.showSuccess(`OTP sent to ${id}`);
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ─── Step 2: Verify OTP ──────────────────────────────────────────────────
  verifyOtp(): void {
    if (!this.userData.otpCode || this.userData.otpCode.length !== 6) {
      this.toastService.showError('Please enter the 6-digit OTP');
      return;
    }
    this.isLoading = true;
    this.authService.verifyRegisterOtp(this.userData.identifier, this.userData.otpCode, this.regMethod).subscribe({
      next: () => {
        this.isLoading = false;
        this.clearTimer();
        this.step = 'DETAILS';
        this.toastService.showSuccess('OTP verified!');
      },
      error: () => { this.isLoading = false; }
    });
  }

  resendOtp(): void {
    this.userData.otpCode = '';
    this.sendOtp();
  }

  // ─── Step 3: Submit Details → move to Payment ────────────────────────────
  submitDetails(): void {
    if (this.regMethod === 'EMAIL') {
      if (!this.userData.secondaryIdentifier.trim()) {
        this.toastService.showError('Phone number is required'); return;
      }
    } else {
      if (!this.userData.secondaryIdentifier.trim() || !this.userData.secondaryIdentifier.includes('@')) {
        this.toastService.showError('A valid email address is required'); return;
      }
    }
    if (!this.userData.username.trim()) {
      this.toastService.showError('Username is required'); return;
    }
    if (!this.userData.fullName.trim()) {
      this.toastService.showError('Full name is required'); return;
    }
    if (!this.userData.password || this.userData.password.length < 6) {
      this.toastService.showError('Password must be at least 6 characters'); return;
    }
    if (this.userData.password !== this.userData.confirmPassword) {
      this.toastService.showError('Passwords do not match'); return;
    }
    if (!this.userData.dateOfBirth) {
      this.toastService.showError('Date of birth is required'); return;
    }
    if (!this.userData.gender) {
      this.toastService.showError('Please select your gender'); return;
    }
    if (!this.userData.address.trim()) {
      this.toastService.showError('Address is required'); return;
    }
    if (!this.userData.village?.trim()) {
      this.toastService.showError('Village / Town is required'); return;
    }
    if (!this.userData.landmark?.trim()) {
      this.toastService.showError('Landmark is required'); return;
    }
    if (!this.userData.block?.trim()) {
      this.toastService.showError('Block / Tehsil is required'); return;
    }
    if (!this.userData.town?.trim()) {
      this.toastService.showError('Town is required'); return;
    }
    if (!this.userData.district?.trim()) {
      this.toastService.showError('District is required'); return;
    }
    if (!this.userData.state.trim()) {
      this.toastService.showError('State is required'); return;
    }
    if (!this.userData.country.trim()) {
      this.toastService.showError('Country is required'); return;
    }
    if (!this.userData.pinCode.trim()) {
      this.toastService.showError('PIN Code is required'); return;
    }
    this.step = 'PAYMENT';
    // Validate promo code if entered
    if (this.userData.promoCode.trim()) {
      this.validatePromoCode();
    }
  }

  // ─── Promo Code Validation ──────────────────────────────────────────────
  validatePromoCode(): void {
    const code = this.userData.promoCode.trim();
    if (!code) { this.promoCodeStatus = 'idle'; this.promoCodeMessage = ''; return; }
    this.promoCodeStatus = 'checking';
    this.apiService.validatePromoCode(code).subscribe({
      next: (res) => {
        if (res.success) {
          this.promoCodeStatus = 'valid';
          this.promoCodeMessage = res.message || 'Valid referral code!';
        } else {
          this.promoCodeStatus = 'invalid';
          this.promoCodeMessage = res.message || 'Invalid or inactive referral code';
        }
      },
      error: () => {
        this.promoCodeStatus = 'invalid';
        this.promoCodeMessage = 'Could not validate code';
      }
    });
  }

  // ─── Step 4: Payment → Complete Registration ─────────────────────────────
  completeRegistration(): void {
    this.isLoading = true;

    const payload: any = {
      username: this.userData.username,
      password: this.userData.password,
      fullName: this.userData.fullName,
      dateOfBirth: this.userData.dateOfBirth,
      gender: this.userData.gender,
      address: this.userData.address,
      block: this.userData.block,
      town: this.userData.town,
      state: this.userData.state,
      village: this.userData.village,
      landmark: this.userData.landmark,
      district: this.userData.district,
      country: this.userData.country,
      pinCode: this.userData.pinCode,
      requestedRole: this.userData.requestedRole,
      otpCode: this.userData.otpCode,
      registrationMethod: this.regMethod,
      zone: this.userData.zone || undefined,
      promoCode: this.userData.promoCode.trim() || undefined
    };

    if (this.userData.photoUrl) {
      payload.photoUrl = this.userData.photoUrl;
    }

    if (this.regMethod === 'EMAIL') {
      payload['email'] = this.userData.identifier;
      payload['phoneNumber'] = this.userData.secondaryIdentifier;
    } else {
      payload['phoneNumber'] = this.userData.identifier;
      payload['email'] = this.userData.secondaryIdentifier;
    }

    this.authService.register(payload).subscribe({
      next: (response) => {
        if (response.success) {
          if (this.paymentChoice === 'NOW') {
            this.authService.login({ username: this.userData.username, password: this.userData.password }).subscribe({
              next: (loginRes) => {
                this.isLoading = false;
                if (loginRes.success) {
                  this.toastService.showSuccess('Registration successful! Opening the payment page...');
                  this.router.navigate(['/payment']);
                } else {
                  this.toastService.showWarning('Account created. Please log in and complete your payment.');
                  this.router.navigate(['/login']);
                }
              },
              error: () => {
                this.isLoading = false;
                this.router.navigate(['/login']);
              }
            });
          } else {
            this.isLoading = false;
            this.toastService.showSuccess('Registration successful! Please log in to your account.');
            this.router.navigate(['/login']);
          }
        } else {
          this.isLoading = false;
          this.toastService.showError(response.message || 'Registration failed');
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ─── 📸 Photo Upload 📸 ──────────────────────────────────────────────────
  onPhotoUploaded(url: string): void {
    this.userData.photoUrl = url;
    // We send photoUrl instead of selectedPhoto now
    this.selectedPhoto = null; 
    this.photoPreviewUrl = url;
  }

  // ─── Timer ────────────────────────────────────────────────────────────────
  startOtpTimer(seconds: number): void {
    this.clearTimer();
    this.otpTimer = seconds;
    this.timerInterval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) this.clearTimer();
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  get timerDisplay(): string {
    const m = Math.floor(this.otpTimer / 60).toString().padStart(2, '0');
    const s = (this.otpTimer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  get stepNumber(): number {
    return { METHOD: 1, OTP: 2, DETAILS: 3, PAYMENT: 4 }[this.step];
  }

  switchMethod(method: 'EMAIL' | 'PHONE'): void {
    this.regMethod = method;
    this.userData.identifier = '';
  }

  goBack(): void {
    const prevMap: Record<Step, Step | null> = {
      METHOD: null, OTP: 'METHOD', DETAILS: 'OTP', PAYMENT: 'DETAILS'
    };
    const prev = prevMap[this.step];
    if (prev) this.step = prev;
  }
}
