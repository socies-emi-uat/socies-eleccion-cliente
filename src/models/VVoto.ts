export interface VTProcesoElectoral {
    nombreProceso: string
    descripcionProceso: string
    fechaInicio: string
    fechaFin: string
    candidaturas: VTCandidatura[]
  }
  
  export interface VTCandidatura {
    nombreCandidatura: string
    lema: string
    partido: VTPartido
    candidato: VTCandidato
  }
  
  export interface VTPartido {
    id: number
    nombrePartido: string
    sigla: string
    lema: string
    logoUrl?: string
    colorHex: string
    pais: string
    representanteLegal: string
    descripcion?: string
    direccionSede: string
    paginaWeb?: string
    telefonoContacto: string
    correoContacto: string
    fechaFundacion: string
    estado: boolean
  }
  
  export interface VTCandidato {
    foto: string
    id: number
    nombreCandidato: string
    apPaterno: string
    apMaterno: string
    fechaNacimiento: string
    fotoUrl?: string
    propuesta: string
    cargo: string
    estado: string
  }
  