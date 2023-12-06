import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

// ANGULAR MATERIAL
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// LIBRARIES
import { ToastrService } from 'ngx-toastr';

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
  private toastrService = inject(ToastrService);

  inputFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[^\\s]+.*[^\\s]+$')],
  });

  @Input() autocompleteData!: [[string, string]];
  @Input() toggleMode!: string;
  @Input() symbol!: string;

  @Output() onTyping = new EventEmitter();
  @Output() onSelection = new EventEmitter();

  debounce: any;

  onSubmit(event: Event) {
    event.preventDefault();
  }

  onTypingHandler() {
    clearTimeout(this.debounce);

    let validateEmitInput = () => {
      if (this.inputFormControl.valid) {
        this.onTyping.emit(['autocomplete', this.inputFormControl.value]);
      }
    };

    this.debounce = setTimeout(validateEmitInput, 300);
  }

  onSelectionHandler() {
    if (this.inputFormControl.valid) {
      this.onSelection.emit([
        this.toggleMode,
        this.inputFormControl.value.toUpperCase(),
      ]);
    } else {
      this.toastrService.error('Type at least 2 letters or numbers!', 'ERROR', {
        closeButton: true,
        timeOut: 3000,
        progressBar: true,
      });
    }
  }
}
