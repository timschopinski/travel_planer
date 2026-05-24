import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maincrud } from './maincrud';

describe('Maincrud', () => {
  let component: Maincrud;
  let fixture: ComponentFixture<Maincrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maincrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maincrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
