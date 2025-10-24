import { validarRUT, validarEmail, validarPassword, validarFormulario, loginUsuario } from './utils';

test('validarRUT devuelve false para RUT inválido', () => {
  expect(validarRUT('12.345.678-9')).toBe(false);
  expect(validarRUT('11111111-2')).toBe(false);
  expect(validarRUT('123')).toBe(false);
});

test('validarRUT devuelve true para RUT válido', () => {
  expect(validarRUT('12.345.678-5')).toBe(true);
});

test('validarEmail devuelve true para un email válido', () => {
  expect(validarEmail('usuario@correo.com')).toBe(true);
});

test('validarEmail devuelve false para email sin formato', () => {
  expect(validarEmail('usuario@correo')).toBe(false);
  expect(validarEmail('usuario.com')).toBe(false);
});

test('validarPassword devuelve false para contraseñas cortas', () => {
  expect(validarPassword('123')).toBe(false);
});

test('validarPassword devuelve true para contraseñas seguras', () => {
  expect(validarPassword('Abc123!@#')).toBe(true);
});

test('validarFormulario devuelve false si hay campos vacíos', () => {
  const datos = { nombre: '', email: 'test@mail.com', password: '1234' };
  expect(validarFormulario(datos)).toBe(false);
});

test('validarFormulario devuelve true con datos válidos', () => {
  const datos = { nombre: 'Alex', email: 'alex@mail.com', password: 'Abc123!' };
  expect(validarFormulario(datos)).toBe(true);
});

test('loginUsuario devuelve true si las credenciales son correctas', () => {
  expect(loginUsuario('usuario', '1234')).toBe(true);
});

test('loginUsuario devuelve false si las credenciales son incorrectas', () => {
  expect(loginUsuario('usuario', 'wrong')).toBe(false);
});
