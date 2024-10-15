import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerativeComponent } from './generative.component';

describe('GenerativeComponent', () => {
  let component: GenerativeComponent;
  let fixture: ComponentFixture<GenerativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
