import { Component, inject } from '@angular/core';
import { ListBoxComponent } from "../list-box/list-box.component";
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { AsyncPipe, NgFor, NgStyle } from '@angular/common';
import { from, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ListBoxComponent,NgFor,AsyncPipe, FormsModule, NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {


}
