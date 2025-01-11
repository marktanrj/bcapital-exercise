import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockSession = {
    userId: null,
    username: null,
    destroy: jest.fn((cb) => cb()),
  };

  const mockRequest = {
    session: mockSession,
  };

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  };

  const mockUserInfo = {
    id: '123',
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
    mockSession.username = null;
  });

  describe('sign up', () => {
    it('should sign up a new user and set session data', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockAuthService.signUp.mockResolvedValue(mockUserInfo);

      const result = await controller.signUp(signUpDto, mockRequest as any);

      expect(authService.signup).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(mockUserInfo);
      expect(mockSession.userId).toBe(mockUserInfo.id);
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
