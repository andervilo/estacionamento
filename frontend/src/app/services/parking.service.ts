import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Veiculo {
    id?: number;
    placa: string;
    modelo: string;
    cor?: string;
    tipo?: string;
}

export interface Registro {
    id: number;
    veiculo: Veiculo;
    dataEntrada: string;
    dataSaida?: string;
    valorTotal?: number;
    status: 'ABERTO' | 'PAGO';
}

export interface DashboardData {
    ocupadas: number;
    disponiveis: number;
}

export interface FaturamentoResponse {
    registros: Registro[];
    totalFaturado: number;
    quantidadeVeiculos: number;
}

@Injectable({
    providedIn: 'root'
})
export class ParkingService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    getDashboard(): Observable<DashboardData> {
        return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
    }

    registrarEntrada(placa: string, modelo: string, cor?: string, tipo?: string): Observable<Registro> {
        return this.http.post<Registro>(`${this.apiUrl}/entrada`, { placa, modelo, cor, tipo });
    }

    listarAbertos(): Observable<Registro[]> {
        return this.http.get<Registro[]>(`${this.apiUrl}/registros/abertos`);
    }

    calcularSaida(id: number): Observable<Registro> {
        return this.http.post<Registro>(`${this.apiUrl}/saida/${id}/calculo`, {});
    }

    confirmarPagamento(id: number): Observable<Registro> {
        return this.http.post<Registro>(`${this.apiUrl}/saida/${id}/confirmar`, {});
    }

    getFaturamento(dataInicio: string, dataFim: string): Observable<FaturamentoResponse> {
        const params = new HttpParams()
            .set('dataInicio', dataInicio)
            .set('dataFim', dataFim);
        return this.http.get<FaturamentoResponse>(`${this.apiUrl}/faturamento`, { params });
    }
}
