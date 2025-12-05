import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ParkingService, DashboardData, Registro, FaturamentoResponse } from './parking.service';
import { vi } from 'vitest';
import { of } from 'rxjs';

describe('ParkingService', () => {
    let service: ParkingService;
    let httpClientMock: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        httpClientMock = {
            get: vi.fn(),
            post: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                ParkingService,
                { provide: HttpClient, useValue: httpClientMock }
            ]
        });
        service = TestBed.inject(ParkingService);
    });

    describe('getDashboard', () => {
        it('deve chamar GET /api/dashboard', () => {
            const mockData: DashboardData = { ocupadas: 10, disponiveis: 40 };
            httpClientMock.get.mockReturnValue(of(mockData));

            service.getDashboard().subscribe(data => {
                expect(data).toEqual(mockData);
                expect(data.ocupadas).toBe(10);
                expect(data.disponiveis).toBe(40);
            });

            expect(httpClientMock.get).toHaveBeenCalledWith('http://localhost:8080/api/dashboard');
        });
    });

    describe('registrarEntrada', () => {
        it('deve chamar POST /api/entrada com dados corretos', () => {
            const mockRegistro: Registro = {
                id: 1,
                veiculo: { placa: 'ABC-1234', modelo: 'Toyota Corolla', cor: 'Prata', tipo: 'CARRO' },
                dataEntrada: '2025-12-05T10:00:00',
                status: 'ABERTO'
            };
            httpClientMock.post.mockReturnValue(of(mockRegistro));

            service.registrarEntrada('ABC-1234', 'Toyota Corolla', 'Prata', 'CARRO').subscribe(data => {
                expect(data).toEqual(mockRegistro);
            });

            expect(httpClientMock.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/entrada',
                { placa: 'ABC-1234', modelo: 'Toyota Corolla', cor: 'Prata', tipo: 'CARRO' }
            );
        });

        it('deve enviar entrada sem cor e tipo opcionais', () => {
            const mockRegistro: Registro = {
                id: 2,
                veiculo: { placa: 'XYZ-5678', modelo: 'Honda Civic' },
                dataEntrada: '2025-12-05T11:00:00',
                status: 'ABERTO'
            };
            httpClientMock.post.mockReturnValue(of(mockRegistro));

            service.registrarEntrada('XYZ-5678', 'Honda Civic').subscribe();

            expect(httpClientMock.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/entrada',
                { placa: 'XYZ-5678', modelo: 'Honda Civic', cor: undefined, tipo: undefined }
            );
        });
    });

    describe('listarAbertos', () => {
        it('deve chamar GET /api/registros/abertos', () => {
            const mockRegistros: Registro[] = [
                { id: 1, veiculo: { placa: 'ABC-1234', modelo: 'Toyota' }, dataEntrada: '2025-12-05T08:00:00', status: 'ABERTO' },
                { id: 2, veiculo: { placa: 'XYZ-5678', modelo: 'Honda' }, dataEntrada: '2025-12-05T09:00:00', status: 'ABERTO' }
            ];
            httpClientMock.get.mockReturnValue(of(mockRegistros));

            service.listarAbertos().subscribe(data => {
                expect(data.length).toBe(2);
            });

            expect(httpClientMock.get).toHaveBeenCalledWith('http://localhost:8080/api/registros/abertos');
        });
    });

    describe('calcularSaida', () => {
        it('deve chamar POST /api/saida/{id}/calculo', () => {
            const mockRegistro: Registro = {
                id: 1,
                veiculo: { placa: 'ABC-1234', modelo: 'Toyota' },
                dataEntrada: '2025-12-05T08:00:00',
                dataSaida: '2025-12-05T10:00:00',
                valorTotal: 15.0,
                status: 'ABERTO'
            };
            httpClientMock.post.mockReturnValue(of(mockRegistro));

            service.calcularSaida(1).subscribe(data => {
                expect(data.valorTotal).toBe(15.0);
            });

            expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:8080/api/saida/1/calculo', {});
        });
    });

    describe('confirmarPagamento', () => {
        it('deve chamar POST /api/saida/{id}/confirmar', () => {
            const mockRegistro: Registro = {
                id: 1,
                veiculo: { placa: 'ABC-1234', modelo: 'Toyota' },
                dataEntrada: '2025-12-05T08:00:00',
                dataSaida: '2025-12-05T10:00:00',
                valorTotal: 15.0,
                status: 'PAGO'
            };
            httpClientMock.post.mockReturnValue(of(mockRegistro));

            service.confirmarPagamento(1).subscribe(data => {
                expect(data.status).toBe('PAGO');
            });

            expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:8080/api/saida/1/confirmar', {});
        });
    });

    describe('getFaturamento', () => {
        it('deve chamar GET /api/faturamento com params', () => {
            const mockResponse: FaturamentoResponse = {
                registros: [{ id: 1, veiculo: { placa: 'ABC-1234', modelo: 'Toyota' }, dataEntrada: '2025-12-05T08:00:00', dataSaida: '2025-12-05T10:00:00', valorTotal: 15.0, status: 'PAGO' }],
                totalFaturado: 15.0,
                quantidadeVeiculos: 1
            };
            httpClientMock.get.mockReturnValue(of(mockResponse));

            service.getFaturamento('2025-12-01T00:00:00', '2025-12-31T23:59:59').subscribe(data => {
                expect(data.totalFaturado).toBe(15.0);
            });

            expect(httpClientMock.get).toHaveBeenCalledWith(
                'http://localhost:8080/api/faturamento',
                expect.objectContaining({ params: expect.anything() })
            );
        });
    });
});
