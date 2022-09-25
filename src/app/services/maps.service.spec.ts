import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapsService
      ]
    });
    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test for get current position', () => {
    it('should get a position', () => {
      // Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (successFn) => {
          const mockGeolocation = {
            coords: {
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              latitude: 1000,
              longitude: 1000,
              speed: 0
            },
            timestamp: 0
          }
          successFn(mockGeolocation);
        }
      );

      service.getCurrentPosition();
      expect(service.center).toEqual({lat: 1000, lng: 1000})
    })
  })
});
