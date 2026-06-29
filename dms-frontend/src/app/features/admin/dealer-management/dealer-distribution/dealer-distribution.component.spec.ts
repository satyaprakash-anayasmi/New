import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerDistributionComponent } from './dealer-distribution.component';

describe('DealerDistributionComponent', () => {
  let component: DealerDistributionComponent;
  let fixture: ComponentFixture<DealerDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerDistributionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
