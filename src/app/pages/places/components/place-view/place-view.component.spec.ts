import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceViewComponent } from './place-view.component';

describe('PlaceViewComponent', () => {
  let component: PlaceViewComponent;
  let fixture: ComponentFixture<PlaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
