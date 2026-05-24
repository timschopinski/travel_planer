import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component2 } from './component2';

describe('Component2', () => {
  let component: Component2;
  let fixture: ComponentFixture<Component2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Component2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
