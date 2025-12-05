import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ExitListComponent } from './exit-list.component';
import { ParkingService, Registro } from '../../services/parking.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('ExitListComponent', () => {
    let component: ExitListComponent;
    let fixture: ComponentFixture<ExitListComponent>;
    let parkingServiceMock: {
        listarAbertos: ReturnType<typeof vi.fn>;
        calcularSaida: ReturnType<typeof vi.fn>;
        confirmarPagamento: ReturnType<typeof vi.fn>;
    };
    let snackBarMock: { open: ReturnType<typeof vi.fn> };
    let dialogMock: { open: ReturnType<typeof vi.fn> };

    const mockRegistros: Registro[] = [
        { id: 1, veiculo: { placa: 'ABC-1234', modelo: 'Toyota' }, dataEntrada: '2025-12-05T08:00:00', status: 'ABERTO' },
        { id: 2, veiculo: { placa: 'XYZ-5678', modelo: 'Honda' }, dataEntrada: '2025-12-05T09:00:00', status: 'ABERTO' }
    ];

    beforeEach(async () => {
        parkingServiceMock = {
            listarAbertos: vi.fn().mockReturnValue(of(mockRegistros)),
            calcularSaida: vi.fn(),
            confirmarPagamento: vi.fn()
        };
        snackBarMock = { open: vi.fn() };
        dialogMock = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };

        await TestBed.configureTestingModule({
            imports: [ExitListComponent, NoopAnimationsModule],
            providers: [
                { provide: ParkingService, useValue: parkingServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: HttpClient, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ExitListComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar registros ao inicializar', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(parkingServiceMock.listarAbertos).toHaveBeenCalled();
        expect(component.registros.length).toBe(2);
        expect(component.loading).toBe(false);
    });

    it('deve tratar erro ao carregar registros', async () => {
        parkingServiceMock.listarAbertos.mockReturnValue(throwError(() => new Error('Erro')));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.error).toContain('Erro ao carregar');
    });

    it('deve calcular saída e abrir dialog', () => {
        const calculado: Registro = {
            id: 1, veiculo: { placa: 'ABC-1234', modelo: 'Toyota' },
            dataEntrada: '2025-12-05T08:00:00', dataSaida: '2025-12-05T10:00:00',
            valorTotal: 15.0, status: 'ABERTO'
        };
        parkingServiceMock.calcularSaida.mockReturnValue(of(calculado));
        parkingServiceMock.confirmarPagamento.mockReturnValue(of({ ...calculado, status: 'PAGO' }));

        fixture.detectChanges();
        component.onExit(mockRegistros[0]);

        expect(parkingServiceMock.calcularSaida).toHaveBeenCalledWith(1);
        expect(dialogMock.open).toHaveBeenCalled();
    });
});
