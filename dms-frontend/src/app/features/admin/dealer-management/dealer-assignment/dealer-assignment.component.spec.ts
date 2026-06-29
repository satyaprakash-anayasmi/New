import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAssignmentComponent } from './dealer-assignment.component';

describe('DealerAssignmentComponent', () => {
  let component: DealerAssignmentComponent;
  let fixture: ComponentFixture<DealerAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
