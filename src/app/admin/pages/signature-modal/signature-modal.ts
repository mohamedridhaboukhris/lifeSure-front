import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { ContratService } from '../../../services/contrat';

@Component({
  selector: 'app-signature-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signature-modal.html',
  styleUrls: ['./signature-modal.css']
})
export class SignatureModalComponent implements AfterViewInit {

  @Input() contratId!: number;
  @Input() contratNumero!: string;
  @Output() signed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('signaturePadCanvas') signaturePadCanvas!: ElementRef<HTMLCanvasElement>;

  private signaturePad!: SignaturePad;
  loading = false;
  errorMessage = '';

  // Cases à cocher
  conditionsLues = false;
  accepteConditions = false;

  constructor(
    private contratService: ContratService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvas = this.signaturePadCanvas.nativeElement;
      this.resizeCanvas(canvas);

      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 80)',
        minWidth: 1,
        maxWidth: 3
      });

      // Redimensionner si la fenêtre change
      window.addEventListener('resize', () => this.resizeCanvas(canvas));
    }, 100);
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')!.scale(ratio, ratio);
  }

  effacerSignature(): void {
    this.signaturePad.clear();
    this.cdr.detectChanges();
  }

  isSignatureValid(): boolean {
    return this.signaturePad && !this.signaturePad.isEmpty();
  }

  canSubmit(): boolean {
    return this.conditionsLues && this.accepteConditions && this.isSignatureValid();
  }

  confirmer(): void {
    if (!this.canSubmit()) {
      this.errorMessage = 'Veuillez accepter les conditions et signer.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // Récupérer la signature en base64
    const signatureBase64 = this.signaturePad.toDataURL('image/png');

    this.contratService.signerContrat(this.contratId, signatureBase64).subscribe({
      next: () => {
        this.loading = false;
        this.signed.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Erreur lors de la signature';
        this.cdr.detectChanges();
      }
    });
  }

  fermer(): void {
    this.closed.emit();
  }
}