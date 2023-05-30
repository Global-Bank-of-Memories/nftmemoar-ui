import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-memo-cube',
  templateUrl: './memo-cube.component.html',
  styleUrls: ['./memo-cube.component.scss']
})
export class MemoCubeComponent implements OnInit, OnChanges {
  @Input() upperImage!: string;
  @Input() leftImage!: string;
  @Input() rightImage!: string;
  player: any;
  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.player = this.elRef.nativeElement.querySelector('video');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.leftImage && this.player) {
      this.player.load();
    }
  }
}
