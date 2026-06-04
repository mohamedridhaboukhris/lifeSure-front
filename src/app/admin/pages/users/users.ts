import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent {
  users = [
    { id: 1, nom: 'Ben Salah', prenom: 'Ahmed', email: 'ahmed@mail.com', telephone: '98000111' },
    { id: 2, nom: 'Trabelsi',  prenom: 'Sara',  email: 'sara@mail.com',  telephone: '98000222' },
    { id: 3, nom: 'Gharbi',    prenom: 'Mohamed', email: 'mohamed@mail.com', telephone: '98000333' }
  ];


  constructor(private cdr: ChangeDetectorRef) {} 
  ngOnInit(): void {
    this.cdr.detectChanges();  // ✅ AJOUTÉ
  }
}