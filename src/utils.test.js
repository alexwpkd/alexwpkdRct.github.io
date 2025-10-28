import { describe, it, expect } from 'vitest';
import { validarRUT, validarEmail, validarPassword, validarFormulario, loginUsuario } from './utils';

describe('Utilidades', () => {
  // validarRUT
  it('validarRUT - Correcto: devuelve true para RUT válido', () => {
    expect(validarRUT('12.345.678-5')).toBe(true);
  });

  it('validarRUT - Incorrecto: devuelve false para RUT inválido', () => {
    expect(validarRUT('12.345.678-9')).toBe(false);
    expect(validarRUT('11111111-2')).toBe(false);
    expect(validarRUT('123')).toBe(false);
  });

  it('validarRUT - Erroneo: lanza TypeError si el tipo es incorrecto', () => {
    expect(() => validarRUT(12345678)).toThrow(TypeError);
  });

  // validarEmail
  it('validarEmail - Correcto: devuelve true para un email válido', () => {
    expect(validarEmail('usuario@correo.com')).toBe(true);
  });

  it('validarEmail - Incorrecto: devuelve false para email sin formato', () => {
    expect(validarEmail('usuario@correo')).toBe(false);
    expect(validarEmail('usuario.com')).toBe(false);
  });

  it('validarEmail - Erroneo: lanza TypeError si el tipo es incorrecto', () => {
    expect(() => validarEmail(123)).toThrow(TypeError);
  });

  // validarPassword
  it('validarPassword - Correcto: devuelve true para contraseñas seguras', () => {
    expect(validarPassword('Abc123!@#')).toBe(true);
  });

  it('validarPassword - Incorrecto: devuelve false para contraseñas cortas o inseguras', () => {
    expect(validarPassword('123')).toBe(false);
    expect(validarPassword('abcdef')).toBe(false);
  });

  it('validarPassword - Erroneo: lanza TypeError si el tipo es incorrecto', () => {
    expect(() => validarPassword(123456)).toThrow(TypeError);
  });

  // validarFormulario
  it('validarFormulario - Correcto: devuelve true con datos válidos', () => {
    const datos = { nombre: 'Alex', email: 'alex@mail.com', password: 'Abc123!' };
    expect(validarFormulario(datos)).toBe(true);
  });

  it('validarFormulario - Incorrecto: devuelve false si hay campos vacíos o inválidos', () => {
    const datos = { nombre: '', email: 'test@mail.com', password: '1234' };
    expect(validarFormulario(datos)).toBe(false);
  });

  it('validarFormulario - Erroneo: lanza TypeError si el parámetro no es un objeto', () => {
    expect(() => validarFormulario('not an object')).toThrow(TypeError);
  });

  // loginUsuario
  it('loginUsuario - Correcto: devuelve true si las credenciales son correctas', () => {
    expect(loginUsuario('usuario', '1234')).toBe(true);
  });

  it('loginUsuario - Incorrecto: devuelve false si las credenciales son incorrectas', () => {
    expect(loginUsuario('usuario', 'wrong')).toBe(false);
  });

  it('loginUsuario - Erroneo: lanza TypeError si los tipos de parámetros son incorrectos', () => {
    expect(() => loginUsuario(123, true)).toThrow(TypeError);
  });
});
