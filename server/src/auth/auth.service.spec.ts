import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: '1',
    username: 'testuser',
    hashedPassword: 'hashedPassword123'
  } as any;

  beforeEach(async () => {
    const mockUserRepository = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
  });

  describe('register', () => {
    const registerDto = {
      username: 'testuser',
      password: 'password123'
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully register a new user', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

      const result = await service.register(registerDto);

      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        registerDto.username
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: registerDto.username,
        hashedPassword: 'hashedPassword123'
      });
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      userRepository.findByUsername.mockRejectedValue(error);

      await expect(service.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123'
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully login a user with valid credentials', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        loginDto.username
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.hashedPassword
      );
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      userRepository.findByUsername.mockRejectedValue(error);

      await expect(service.login(loginDto)).rejects.toThrow(error);
    });
  });
});