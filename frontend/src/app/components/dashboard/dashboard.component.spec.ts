import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { ParkingService, DashboardData } from '../../services/parking.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let parkingServiceMock: { getDashboard: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        parkingServiceMock = {
            getDashboard: vi.fn().mockReturnValue(of({ ocupadas: 0, disponiveis: 50 }))
        };

        await TestBed.configureTestingModule({
            imports: [DashboardComponent, NoopAnimationsModule],
            providers: [
                { provide: ParkingService, useValue: parkingServiceMock },
                { provide: HttpClient, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar com valores zerados', () => {
        expect(component.ocupadas).toBe(0);
        expect(component.disponiveis).toBe(0);
    });

    it('deve carregar dados ao inicializar', async () => {
        const mockData: DashboardData = { ocupadas: 15, disponiveis: 35 };
        parkingServiceMock.getDashboard.mockReturnValue(of(mockData));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(parkingServiceMock.getDashboard).toHaveBeenCalled();
        expect(component.ocupadas).toBe(15);
        expect(component.disponiveis).toBe(35);
    });

    it('deve atualizar a view com dados carregados', async () => {
        const mockData: DashboardData = { ocupadas: 20, disponiveis: 30 };
        parkingServiceMock.getDashboard.mockReturnValue(of(mockData));

        fixture.detectChanges();
        await fixture.whenStable();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('20');
        expect(compiled.textContent).toContain('30');
    });
});
