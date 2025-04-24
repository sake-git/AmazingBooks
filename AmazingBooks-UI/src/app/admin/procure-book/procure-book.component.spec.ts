import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcureBookComponent } from './procure-book.component';

describe('ProcureBookComponent', () => {
  let component: ProcureBookComponent;
  let fixture: ComponentFixture<ProcureBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcureBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcureBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
