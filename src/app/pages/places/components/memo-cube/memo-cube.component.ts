import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-memo-cube',
  animations: [
    trigger('allSide', [
      state('front', style({
        height: '300px',
        width: '300px',
        transform: 'rotateX(252deg) rotateY(0deg) rotateZ(-180deg)',
        top: '140px'
      })),
      state('top', style({
        height: '300px',
        width: '300px',
        transform: 'rotateX(180deg) rotateY(0deg) rotateZ(-180deg)'
      })),
      state('all', style({
        height: '200px',
        width: '200px',
        transform: 'rotateX(240deg) rotateY(0deg) rotateZ(-130deg)'
      })),
      transition('all <=> *', [
        animate('1000ms')
      ]),
    ]),
  ],
  templateUrl: './memo-cube.component.html',
  styleUrls: ['./memo-cube.component.scss']
})
export class MemoCubeComponent implements OnInit, OnChanges {
  @Input() upperImage!: string;
  @Input() leftImage!: string;
  @Input() rightImage!: string;
  player: any;
  cubeState: string = 'all';

  constructor(
    private elRef: ElementRef,
    private httpClient: HttpClient
  ) {
  }

  get isAll(): boolean {
    return this.cubeState === 'all';
  }

  ngOnInit(): void {
    this.player = this.elRef.nativeElement.querySelector('video');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.leftImage && this.player) {
      this.player.load();
    }
  }

  showFront() {
    this.cubeState = 'front';
  }

  showTop() {
    this.cubeState = 'top'
  }

  showAll() {
    this.cubeState = 'all';
  }

  downloadImage(url) {
    this.httpClient.get(url, {responseType: 'blob' as 'json'})
      .subscribe((res: any) => {
        const file = new Blob([res], {type: 'image/jpeg'});
        const fileURL = URL.createObjectURL(file);
        // create a link and simulate click
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', 'image.jpeg');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}
