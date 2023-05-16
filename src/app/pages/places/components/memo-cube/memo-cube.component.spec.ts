import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoCubeComponent } from './memo-cube.component';

describe('MemoCubeComponent', () => {
  let component: MemoCubeComponent;
  let fixture: ComponentFixture<MemoCubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemoCubeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
