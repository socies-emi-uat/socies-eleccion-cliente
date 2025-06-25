export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
}

export interface LoginUsuarioResponse {
    id: string;
    name: string;
    rol: string;
    email: string;
    token: string;
}