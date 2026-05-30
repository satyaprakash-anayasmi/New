import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { ConfigService } from '../../../core/services/config.service';

describe('DataTableComponent', () => {
    let component: DataTableComponent;
    let fixture: ComponentFixture<DataTableComponent>;

    const mockConfigService = {
        text: {
            common: {
                loading: 'Loading...'
            }
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataTableComponent],
            providers: [
                { provide: ConfigService, useValue: mockConfigService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DataTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit selectionChange when item is toggled', () => {
        const spy = spyOn(component.selectionChange, 'emit');
        const item = { id: 1, name: 'Test' };

        component.toggleSelection(item, new MouseEvent('click'));

        expect(spy).toHaveBeenCalled();
        expect(component.selectedItems.length).toBe(1);
    });

    it('should format status correctly', () => {
        expect(component.formatStatus('IN_PROGRESS')).toBe('IN PROGRESS');
    });
});
