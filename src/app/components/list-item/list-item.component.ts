import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {

  

}
