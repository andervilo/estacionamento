import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog.component';
import { Registro } from '../../services/parking.service';
import { vi } from 'vitest';

describe('PaymentDialogComponent', () => {
    let component: PaymentDialogComponent;
    let fixture: ComponentFixture<PaymentDialogComponent>;
    let dialogRefMock: { close: ReturnType<typeof vi.fn> };

    const mockRegistro: Registro = {
        id: 1,
        veiculo: { placa: 'ABC-1234', modelo: 'Toyota Corolla', cor: 'Prata', tipo: 'CARRO' },
        dataEntrada: '2025-12-05T08:00:00',
        dataSaida: '2025-12-05T10:00:00',
        valorTotal: 15.0,
        status: 'ABERTO'
    };

    beforeEach(async () => {
        dialogRefMock = {
            close: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [PaymentDialogComponent, NoopAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefMock },
                { provide: MAT_DIALOG_DATA, useValue: mockRegistro }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PaymentDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve receber dados do registro', () => {
        expect(component.data).toEqual(mockRegistro);
        expect(component.data.veiculo.placa).toBe('ABC-1234');
        expect(component.data.valorTotal).toBe(15.0);
    });

    it('deve exibir placa do veículo', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('ABC-1234');
    });

    it('deve exibir valor total formatado', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // Currency pipe formats as "R$ 15,00" in pt-BR
        expect(compiled.textContent).toContain('15');
    });

    it('deve ter referência ao dialogRef', () => {
        expect(component.dialogRef).toBeDefined();
    });
});
