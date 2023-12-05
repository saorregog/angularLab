import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

// ANGULAR MATERIAL
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-typehead',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './typehead.component.html',
  styleUrl: './typehead.component.css',
})
export class TypeheadComponent {
  inputFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[^\\s]+.*[^\\s]+$')],
  });

  @Input() autocompleteData!: [[string, string]];
  @Input() toggleMode!: string;

  @Output() onTyping = new EventEmitter();
  @Output() onSelection = new EventEmitter();

  onTypingHandler() {
    if (this.inputFormControl.valid) {
      this.onTyping.emit(['autocomplete', this.inputFormControl.value]);
    }
  }

  onSelectionHandler() {
    this.onSelection.emit([this.toggleMode, this.inputFormControl.value]);
  }
}
