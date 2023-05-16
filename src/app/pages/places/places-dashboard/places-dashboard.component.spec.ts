import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesDashboardComponent } from './places-dashboard.component';

describe('PlacesDashboardComponent', () => {
  let component: PlacesDashboardComponent;
  let fixture: ComponentFixture<PlacesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
