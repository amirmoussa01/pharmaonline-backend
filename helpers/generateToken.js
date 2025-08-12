import jwt from 'jsonwebtoken';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role }, 
    'secret_key',
    { expiresIn: '5h' }
  );
}

