import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { Subject } from 'rxjs';

describe('ToastComponent', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let toastsSubject: Subject<ToastMessage>;

    beforeEach(async () => {
        toastsSubject = new Subject<ToastMessage>();
        const mockToastService = {
            toasts$: toastsSubject.asObservable()
        };

        await TestBed.configureTestingModule({
            imports: [ToastComponent],
            providers: [
                { provide: ToastService, useValue: mockToastService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add toast when message is received', () => {
        toastsSubject.next({ id: 1, title: 'Success', message: 'Done', type: 'success' });
        expect(component.activeToasts.length).toBe(1);
        expect(component.activeToasts[0].title).toBe('Success');
    });

    it('should remove toast after timeout', fakeAsync(() => {
        toastsSubject.next({ id: 1, title: 'Success', message: 'Done', type: 'success' });
        expect(component.activeToasts.length).toBe(1);

        tick(5001);
        expect(component.activeToasts.length).toBe(0);
    }));

    it('should remove toast manually', () => {
        component.activeToasts = [{ id: 1, title: 'Test', message: 'Test', type: 'info' }];
        component.remove(1);
        expect(component.activeToasts.length).toBe(0);
    });
});
