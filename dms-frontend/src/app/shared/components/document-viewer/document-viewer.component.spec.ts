import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentViewerComponent } from './document-viewer.component';
import { DocumentService } from '../../../core/services/document.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('DocumentViewerComponent', () => {
    let component: DocumentViewerComponent;
    let fixture: ComponentFixture<DocumentViewerComponent>;

    const mockDocumentService = {
        downloadDocument: () => of(new Blob())
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentViewerComponent],
            providers: [
                { provide: DocumentService, useValue: mockDocumentService },
                {
                    provide: DomSanitizer,
                    useValue: {
                        bypassSecurityTrustResourceUrl: (val: string) => val,
                        sanitize: (ctx: any, val: string) => val,
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DocumentViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format size correctly', () => {
        expect(component.formatSize(1024)).toBe('1.00 KB');
        expect(component.formatSize(1048576)).toBe('1.00 MB');
    });

    it('should emit close event when onClose is called', () => {
        const spy = spyOn(component.close, 'emit');
        component.onClose();
        expect(spy).toHaveBeenCalled();
    });
});
