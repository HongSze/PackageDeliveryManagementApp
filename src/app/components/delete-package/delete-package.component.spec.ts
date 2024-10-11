import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePackageComponent } from './delete-package.component';

describe('DeletePackageComponent', () => {
  let component: DeletePackageComponent;
  let fixture: ComponentFixture<DeletePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
