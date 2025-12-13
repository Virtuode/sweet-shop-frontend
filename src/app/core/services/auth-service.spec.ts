import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no open requests match
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to login', () => {
    const mockResponse = { 
      message: 'Success', 
      token: 'fake-jwt-token', 
      email: 'test@test.com' 
    };
    
    const credentials = { email: 'test@test.com', password: 'password123' };

    service.login(credentials).subscribe(response => {
      expect(response.token).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    
    req.flush(mockResponse); // Simulate backend response
  });
});