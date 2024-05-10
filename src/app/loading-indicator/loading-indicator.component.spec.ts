import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { LoadingService } from '../loading.service';

describe('LoadingIndicatorComponent', () => {
    let component: LoadingIndicatorComponent;
    let fixture: ComponentFixture<LoadingIndicatorComponent>;
    let loadingService: LoadingService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, LoadingIndicatorComponent],
            providers: [LoadingService]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingIndicatorComponent);
        component = fixture.componentInstance;
        loadingService = TestBed.inject(LoadingService);
    });

    it('should be created', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should show loading spinner when loading is true', () => {
        loadingService.show();
        fixture.detectChanges();
        const loadingElement = fixture.nativeElement.querySelector('.loading-spinner');
        expect(loadingElement).toBeTruthy();
    });

    it('should hide loading spinner when loading is false', () => {
        loadingService.hide();
        fixture.detectChanges();
        const loadingElement = fixture.nativeElement.querySelector('.loading-spinner');
        expect(loadingElement).toBeFalsy();
    });
});
