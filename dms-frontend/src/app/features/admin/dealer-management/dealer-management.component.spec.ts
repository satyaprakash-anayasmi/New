import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerManagementComponent } from './dealer-management.component';

describe('DealerManagementComponent', () => {
  let component: DealerManagementComponent;
  let fixture: ComponentFixture<DealerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
