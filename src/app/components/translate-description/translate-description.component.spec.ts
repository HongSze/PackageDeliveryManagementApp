import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateDescriptionComponent } from './translate-description.component';

describe('TranslateDescriptionComponent', () => {
  let component: TranslateDescriptionComponent;
  let fixture: ComponentFixture<TranslateDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslateDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
