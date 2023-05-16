import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPlaceComponent } from './create-edit-place.component';

describe('CreateEditPlaceComponent', () => {
  let component: CreateEditPlaceComponent;
  let fixture: ComponentFixture<CreateEditPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditPlaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
