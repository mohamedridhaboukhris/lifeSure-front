import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [],
  templateUrl: './admin-footer.html',
  styleUrls: ['./admin-footer.css']
})
export class AdminFooterComponent {
  currentYear = new Date().getFullYear();
}