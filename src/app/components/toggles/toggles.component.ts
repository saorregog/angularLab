import { Component, EventEmitter, Input, Output } from '@angular/core';

// ANGULAR MATERIAL
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-toggles',
  standalone: true,
  imports: [MatButtonToggleModule, MatSlideToggleModule],
  templateUrl: './toggles.component.html',
  styleUrl: './toggles.component.css',
})
export class TogglesComponent {
  @Input() toggleMode!: string;
  @Input() autoScale!: boolean;

  @Output() onToggle = new EventEmitter();
  @Output() onAutoScale = new EventEmitter();

  onToggleHandler(event: Event) {
    this.onToggle.emit(
      (event.target as HTMLInputElement).innerText.toLowerCase()
    );
  }

  onAutoScaleHandler() {
    this.onAutoScale.emit();
  }
}
