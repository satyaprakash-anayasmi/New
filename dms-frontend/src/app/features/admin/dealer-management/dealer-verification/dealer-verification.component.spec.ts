import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerVerificationComponent } from './dealer-verification.component';

describe('DealerVerificationComponent', () => {
  let component: DealerVerificationComponent;
  let fixture: ComponentFixture<DealerVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
