import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-memo-cube',
  templateUrl: './memo-cube.component.html',
  styleUrls: ['./memo-cube.component.scss']
})
export class MemoCubeComponent {
  @Input() upperImage!: string;
  @Input() leftImage!: string;
  @Input() rightImage!: string;
}
