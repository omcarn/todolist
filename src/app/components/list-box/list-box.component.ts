import { AfterContentChecked, AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { filter, from, map, Observable, of, startWith } from 'rxjs';
import { ListItemComponent } from "../list-item/list-item.component";
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-list-box',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, FormsModule, NgStyle, NgClass, ListItemComponent, MatSelectModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatAutocompleteModule, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.scss'
})
export class ListBoxComponent implements OnInit, AfterViewInit {

  myControl = new FormControl('');
  fireStore = inject(Firestore);
  itemCollection = collection(this.fireStore, 'todos');
  items$ = collectionData(this.itemCollection, { idField: 'id' });
  filteredOptions$?: Observable<(DocumentData | (DocumentData & { id: string; }))[]>;
  @ViewChild('trigger') trigger!: MatAutocompleteTrigger;

  ngOnInit(): void {
    this.filteredOptions$ = this.items$;
    this.myControl.valueChanges.subscribe((value: any) =>
      this.filteredOptions$ = this._filter(String(value)?.toLowerCase() || '')
    );
  }

  ngAfterViewInit(): void {
    this.trigger.openPanel();
  }

  newData(event: any) {
    event.code == 'Enter' && this.myControl.value !== '' ? this.addTodo(this.myControl?.value!) : null;
  }

  private _filter(value: string): Observable<(DocumentData | (DocumentData & { id: string; }))[]> {
    const filterValue = value
    return this.items$.pipe(map(result => result.filter(val => String(val['text']).includes(filterValue))))
  }

  addTodo(value: string): Observable<string> {
    const todoToCreate = { text: value, isCompleted: false, isChecked: false, isEditable: false }
    const promise = addDoc(this.itemCollection, todoToCreate).then(response => {
      return response.id
    });
    this.myControl.setValue('')
    return from(promise);
  }

  removeTodo($event: any, id: string): Observable<void> {

    const docRef = doc(this.fireStore, "todos/", id)

    const promise = deleteDoc(docRef);
    $event.stopPropagation()

    return from(promise)
  }

  updateTodo(event: any, item: any) {

    if (item['text'] === '') {
      alert('Please enter text.')
      document.getElementById('inputBox')?.focus();
      return;
    }

    const docRef = doc(this.fireStore, "todos/", item['id'])

    if (item['isEditable']) {
      item['isEditable'] = false;
      const promise1 = setDoc(docRef, { ...item, text: item['text'], isEditable: item['isEditable'] });
      this.items$ = collectionData(this.itemCollection, { idField: 'id' });
      event.stopPropagation()
    }

  }

  stopEvent(event: any, item: any) {
    event.stopImmediatePropagation()
    event.preventDefault()
  }

  oncheckclick(event: any, item: any) {
    event.stopImmediatePropagation()
    event.preventDefault()
  }

  onexactcheckclick(event: any, item: any) {

    if (!item['isEditable'])
      item['isChecked'] = !item['isChecked'];
    event.stopImmediatePropagation()
  }

  oneditclick(event: any, item: any) {
    event.stopImmediatePropagation()
    item['isEditable'] = true;
    setTimeout(() => {
      let input = document.getElementById(`inputBox${item['id']}`);
      input?.focus();
    }, 500);
  }

}
