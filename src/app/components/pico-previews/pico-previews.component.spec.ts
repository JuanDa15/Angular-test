import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicoPreviewsComponent } from './pico-previews.component';

describe('PicoPreviewsComponent', () => {
  let component: PicoPreviewsComponent;
  let fixture: ComponentFixture<PicoPreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicoPreviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicoPreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
