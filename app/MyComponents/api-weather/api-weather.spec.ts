import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiWeather } from './api-weather';

describe('ApiWeather', () => {
  let component: ApiWeather;
  let fixture: ComponentFixture<ApiWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiWeather]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiWeather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
