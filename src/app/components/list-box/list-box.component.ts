import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { filter, from, map, Observable, of, startWith } from 'rxjs';
import { ListItemComponent } from "../list-item/list-item.component";
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-list-box',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, FormsModule, NgStyle,NgClass, ListItemComponent,MatSelectModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatAutocompleteModule,MatButtonModule,MatIconModule],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.scss'
})
export class ListBoxComponent implements OnInit{
  myControl = new FormControl('');
  fireStore = inject(Firestore);
  itemCollection = collection(this.fireStore,'todos');
  items$ = collectionData(this.itemCollection,{idField : 'id'});
  filteredOptions$? : Observable<(DocumentData | (DocumentData & { id: string; }))[]>;


  @ViewChild(MatAutocomplete) matpanel! : MatAutocomplete;


  ngOnInit(): void {

    this.filteredOptions$ = this.items$;
    this.myControl.valueChanges.subscribe((value:any) => 
      this.filteredOptions$ = this._filter(String(value)?.toLowerCase() || '')
    );
    
  }

  newData(event : any){
    event.code == 'Enter' && this.myControl.value !=='' ? this.addTodo(this.myControl.value || '') : null;
  }

  private _filter(value: string): Observable<(DocumentData | (DocumentData & { id: string; }))[]> {
    const filterValue = value
    return this.items$.pipe(map(result=>result.filter(val=> String(val['text']).includes(filterValue))))
  }

    addTodo(value:string): Observable<string>{

      const todoToCreate = { text : value, isCompleted: false, isChecked:false, isEditable: false}
      const promise = addDoc(this.itemCollection, todoToCreate).then(response=>{
        return response.id
      });
      this.myControl.setValue('')
      return from(promise);
    }

    removeTodo($event: any, id : string): Observable<void> {

      const docRef = doc(this.fireStore,"todos/",id)

      const promise = deleteDoc(docRef);
      $event.stopPropagation()
      
      return from(promise)
    }

    updateTodo(event: any, item : any) {

      const docRef = doc(this.fireStore,"todos/",item['id'])

      if(item['isEditable']){
        item['isEditable'] = false;
      const promise1 = setDoc(docRef,{...item,text:item['text'], isEditable: item['isEditable']});
      this.items$ = collectionData(this.itemCollection,{idField : 'id'});
      event.stopPropagation()            
      }
      else{

      }
    }

    stopEvent(event:any,item:any){

      //event.currentTarget.classList.contains('editbtns')  && item['']? 

      event.stopImmediatePropagation()
      event.preventDefault()
      
    }

    oncheckclick(event:any,item:any){
      
      //item['isChecked'] = !item['isChecked'];
      event.stopImmediatePropagation()
      event.preventDefault()
    }

    onexactcheckclick(event:any,item:any){
      
      item['isChecked'] = !item['isChecked'];
      event.stopImmediatePropagation()
    }

    oneditclick( event : any, item :any){
      item['isEditable'] = true;
      event.stopImmediatePropagation()
      
    }

}
