import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerProductsComponent } from './dealer-products.component';

describe('DealerProductsComponent', () => {
  let component: DealerProductsComponent;
  let fixture: ComponentFixture<DealerProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
