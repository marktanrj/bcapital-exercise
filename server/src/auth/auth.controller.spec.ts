import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockSession = {
    userId: null,
    email: null,
    username: null,
    destroy: jest.fn((cb) => cb()),
  };

  const mockRequest = {
    session: mockSession,
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockUserInfo = {
    id: '123',
    email: 'test@example.com',
    username: 'testuser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockSession.userId = null;
    mockSession.email = null;
    mockSession.username = null;
  });

  describe('register', () => {
    it('should register a new user and set session data', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(mockUserInfo);

      const result = await controller.register(registerDto, mockRequest as any);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUserInfo);
      expect(mockSession.userId).toBe(mockUserInfo.id);
      expect(mockSession.email).toBe(mockUserInfo.email);
      expect(mockSession.username).toBe(mockUserInfo.username);
    });
  });

  describe('login', () => {
    it('should login user and set session data', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockUserInfo);

      const result = await controller.login(loginDto, mockRequest as any);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockUserInfo);
      expect(mockSession.userId).toBe(mockUserInfo.id);
      expect(mockSession.email).toBe(mockUserInfo.email);
      expect(mockSession.username).toBe(mockUserInfo.username);
    });
  });

  describe('logout', () => {
    it('should destroy session and return success message', async () => {
      const result = await controller.logout(mockRequest as any);

      expect(mockSession.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});