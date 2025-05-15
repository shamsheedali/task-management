export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export const toUserResponseDTO = (user: {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  passwordHash?: string;
}): UserResponseDTO => ({
  id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
});
