export interface PPartido {
    id: number
    nombrePartido: string
    sigla: string
    lema: string
    logoUrl: string
    colorHex: string
    pais: string
    representanteLegal: string
    descripcion: string
    direccionSede: string
    paginaWeb: string
    telefonoContacto: string
    correoContacto: string
    fechaFundacion: string
    estado: boolean
    foto: string
    candidaturas: PCandidatura[]
  }
  
  export interface PCandidatura {
    nombreCandidatura: string
    lema: string
    candidato: PCandidato
  }
  
  export interface PCandidato {
    id: number
    nombreCandidato: string
    apPaterno: string
    apMaterno: string
    fechaNacimiento: string
    fotoUrl: string
    propuesta: string
    cargo: string
    estado: string
    foto: string
  }
  