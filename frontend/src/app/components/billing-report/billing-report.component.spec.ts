import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BillingReportComponent } from './billing-report.component';
import { ParkingService, FaturamentoResponse } from '../../services/parking.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('BillingReportComponent', () => {
    let component: BillingReportComponent;
    let fixture: ComponentFixture<BillingReportComponent>;
    let parkingServiceMock: { getFaturamento: ReturnType<typeof vi.fn> };
    let snackBarMock: { open: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        parkingServiceMock = { getFaturamento: vi.fn() };
        snackBarMock = { open: vi.fn() };

        await TestBed.configureTestingModule({
            imports: [BillingReportComponent, NoopAnimationsModule],
            providers: [
                { provide: ParkingService, useValue: parkingServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: HttpClient, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BillingReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar com datas padrão', () => {
        expect(component.dataInicio).toBeInstanceOf(Date);
        expect(component.dataFim).toBeInstanceOf(Date);
        expect(component.loading).toBe(false);
    });

    it('deve formatar data de início corretamente', () => {
        component.dataInicio = new Date(2025, 11, 1);
        const formatted = component.formatDate(component.dataInicio, false);
        expect(formatted).toContain('00:00:00');
    });

    it('deve formatar data final com horário final', () => {
        component.dataFim = new Date(2025, 11, 31);
        const formatted = component.formatDate(component.dataFim, true);
        expect(formatted).toContain('23:59:59');
    });

    it('deve buscar faturamento com sucesso', async () => {
        const mockResponse: FaturamentoResponse = {
            registros: [{ id: 1, veiculo: { placa: 'ABC-1234', modelo: 'Toyota' }, dataEntrada: '2025-12-05T08:00:00', dataSaida: '2025-12-05T10:00:00', valorTotal: 15.0, status: 'PAGO' }],
            totalFaturado: 15.0,
            quantidadeVeiculos: 1
        };
        parkingServiceMock.getFaturamento.mockReturnValue(of(mockResponse));

        component.buscar();
        await fixture.whenStable();

        expect(component.resultado).toEqual(mockResponse);
    });
});
