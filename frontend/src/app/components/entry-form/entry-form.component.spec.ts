import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntryFormComponent } from './entry-form.component';
import { ParkingService, Registro } from '../../services/parking.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('EntryFormComponent', () => {
    let component: EntryFormComponent;
    let fixture: ComponentFixture<EntryFormComponent>;
    let parkingServiceMock: { registrarEntrada: ReturnType<typeof vi.fn> };
    let snackBarMock: { open: ReturnType<typeof vi.fn> };
    let dialogMock: { open: ReturnType<typeof vi.fn> };
    let routerMock: { navigate: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        parkingServiceMock = {
            registrarEntrada: vi.fn()
        };
        snackBarMock = {
            open: vi.fn()
        };
        dialogMock = {
            open: vi.fn().mockReturnValue({ afterClosed: () => of(true) })
        };
        routerMock = {
            navigate: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [EntryFormComponent, NoopAnimationsModule],
            providers: [
                { provide: ParkingService, useValue: parkingServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: Router, useValue: routerMock },
                { provide: HttpClient, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EntryFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar com campos vazios', () => {
        expect(component.placa).toBe('');
        expect(component.modelo).toBe('');
        expect(component.loading).toBe(false);
    });

    it('deve submeter formulário com dados corretos', () => {
        const mockRegistro: Registro = {
            id: 1,
            veiculo: { placa: 'ABC-1234', modelo: 'Toyota Corolla' },
            dataEntrada: '2025-12-05T10:00:00',
            status: 'ABERTO'
        };
        parkingServiceMock.registrarEntrada.mockReturnValue(of(mockRegistro));

        component.placa = 'ABC-1234';
        component.modelo = 'Toyota Corolla';
        component.cor = 'Prata';
        component.tipo = 'CARRO';
        component.onSubmit();

        expect(parkingServiceMock.registrarEntrada).toHaveBeenCalledWith('ABC-1234', 'Toyota Corolla', 'Prata', 'CARRO');
    });

    it('deve exibir erro em caso de falha', () => {
        parkingServiceMock.registrarEntrada.mockReturnValue(throwError(() => new Error('Erro')));

        component.placa = 'ERR-0000';
        component.modelo = 'Erro';
        component.onSubmit();

        expect(snackBarMock.open).toHaveBeenCalledWith('Erro ao registrar entrada.', 'Fechar', { duration: 3000 });
    });
});
