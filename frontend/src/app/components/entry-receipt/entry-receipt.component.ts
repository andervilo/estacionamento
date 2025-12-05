import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Registro } from '../../services/parking.service';

@Component({
    selector: 'app-entry-receipt',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="receipt-container" id="printableReceipt">
      <!-- Header -->
      <div class="receipt-header">
        <div class="logo">
          <mat-icon class="logo-icon">local_parking</mat-icon>
          <span class="logo-text">ParkFlow</span>
        </div>
        <h2 class="receipt-title">COMPROVANTE DE ENTRADA</h2>
      </div>

      <!-- Divider -->
      <div class="divider dashed"></div>

      <!-- Ticket Number -->
      <div class="ticket-number">
        <span class="ticket-label">Nº do Ticket</span>
        <span class="ticket-value">#{{ data.id.toString().padStart(6, '0') }}</span>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Vehicle Info -->
      <div class="info-section">
        <div class="info-row highlight">
          <mat-icon>badge</mat-icon>
          <div class="info-content">
            <span class="info-label">PLACA</span>
            <span class="info-value plate">{{ data.veiculo?.placa }}</span>
          </div>
        </div>

        <div class="info-row">
          <mat-icon>directions_car</mat-icon>
          <div class="info-content">
            <span class="info-label">Veículo</span>
            <span class="info-value">{{ data.veiculo?.modelo }}</span>
          </div>
        </div>

        <div class="info-row" *ngIf="data.veiculo?.cor">
          <mat-icon>palette</mat-icon>
          <div class="info-content">
            <span class="info-label">Cor</span>
            <span class="info-value">{{ data.veiculo?.cor }}</span>
          </div>
        </div>

        <div class="info-row" *ngIf="data.veiculo?.tipo">
          <mat-icon>category</mat-icon>
          <div class="info-content">
            <span class="info-label">Tipo</span>
            <span class="info-value">{{ data.veiculo?.tipo }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Entry Time -->
      <div class="time-section">
        <mat-icon class="time-icon">schedule</mat-icon>
        <div class="time-content">
          <span class="time-label">Data e Hora de Entrada</span>
          <span class="time-value">{{ data.dataEntrada | date:'dd/MM/yyyy' }}</span>
          <span class="time-value big">{{ data.dataEntrada | date:'HH:mm' }}</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider dashed"></div>

      <!-- Pricing Info -->
      <div class="pricing-section">
        <div class="pricing-title">TABELA DE PREÇOS</div>
        <div class="pricing-row">
          <span>Primeira hora</span>
          <span class="price">R$ 10,00</span>
        </div>
        <div class="pricing-row">
          <span>Hora adicional</span>
          <span class="price">R$ 5,00</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider dashed"></div>

      <!-- Footer -->
      <div class="receipt-footer">
        <p class="footer-warning">
          <mat-icon>warning</mat-icon>
          Guarde este comprovante
        </p>
        <p class="footer-note">Necessário para retirada do veículo</p>
        <p class="footer-thanks">Obrigado pela preferência!</p>
      </div>
    </div>

    <!-- Action Buttons (não aparece na impressão) -->
    <div class="action-buttons no-print">
      <button mat-stroked-button (click)="close()">
        <mat-icon>close</mat-icon>
        Fechar
      </button>
      <button mat-raised-button color="primary" (click)="print()">
        <mat-icon>print</mat-icon>
        Imprimir
      </button>
    </div>
  `,
    styles: [`
    .receipt-container {
      width: 320px;
      background: white;
      padding: 24px;
      font-family: 'Courier New', monospace;
    }

    .receipt-header {
      text-align: center;
      margin-bottom: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3b82f6;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
    }

    .receipt-title {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      letter-spacing: 1px;
    }

    .divider {
      border-bottom: 1px solid #e2e8f0;
      margin: 16px 0;
    }

    .divider.dashed {
      border-bottom-style: dashed;
    }

    .ticket-number {
      text-align: center;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
    }

    .ticket-label {
      display: block;
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .ticket-value {
      font-size: 28px;
      font-weight: bold;
      color: #3b82f6;
      letter-spacing: 2px;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-row mat-icon {
      color: #94a3b8;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .info-row.highlight {
      background: #fef3c7;
      padding: 12px;
      border-radius: 8px;
      margin: 0 -12px;
    }

    .info-row.highlight mat-icon {
      color: #d97706;
    }

    .info-content {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
    }

    .info-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }

    .info-value.plate {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .time-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
      padding: 16px;
      background: #f0fdf4;
      border-radius: 8px;
    }

    .time-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #22c55e;
    }

    .time-content {
      display: flex;
      flex-direction: column;
    }

    .time-label {
      font-size: 10px;
      color: #64748b;
    }

    .time-value {
      font-size: 14px;
      color: #1e293b;
    }

    .time-value.big {
      font-size: 28px;
      font-weight: bold;
      color: #22c55e;
    }

    .pricing-section {
      text-align: center;
    }

    .pricing-title {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 8px;
    }

    .pricing-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #475569;
      padding: 4px 0;
    }

    .pricing-row .price {
      font-weight: bold;
    }

    .receipt-footer {
      text-align: center;
    }

    .footer-warning {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      color: #dc2626;
      font-size: 12px;
      font-weight: bold;
      margin: 0 0 4px 0;
    }

    .footer-warning mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .footer-note {
      font-size: 11px;
      color: #64748b;
      margin: 0 0 12px 0;
    }

    .footer-thanks {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .action-buttons button mat-icon {
      margin-right: 8px;
    }

    @media print {
      .no-print {
        display: none !important;
      }

      .receipt-container {
        width: 80mm;
        padding: 8mm;
      }
    }
  `]
})
export class EntryReceiptComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Registro,
        private dialogRef: MatDialogRef<EntryReceiptComponent>
    ) { }

    print() {
        window.print();
    }

    close() {
        this.dialogRef.close();
    }
}
