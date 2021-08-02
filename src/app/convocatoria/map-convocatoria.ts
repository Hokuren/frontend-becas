export enum ESTADO_CONVOCATORIA {
  CERRADA = 'CERRADA',
  ABIERTA = 'PUBLICADA',
  OCULTA = 'OCULTA'
}

export interface ProgramaMap {
  covocatoria_id: number,
  programa_id: number,
  nombre: string,
  criterios: CriterioMap[]
}

export interface CriterioMap {
  criterio_id: number,
  nombre: string,
  tipo_de_criterio: string,
  valor_uno: string,
  valor_dos: string,
  peso_criterio: number,
  convo_progra_id: number
}

export interface ConvocatoriaMap {
  convocatoria_id: number,
  estado: ESTADO_CONVOCATORIA
  nombre: string,
  monto: number,
  fecha_inicio: Date,
  fecha_fin: Date,

}

export interface ServerResponseProgram {
  convo_progra_id?: number,
  convocatoria_id: number,
  criterio_id?: number,
  peso_criterio?: number,
  programa_id: number,
  convocatoria?: {
    convocatoria_id: number,
    nombre: string,
    monto: number,
    fecha_inicio: Date,
    fecha_fin: Date,
    estado: ESTADO_CONVOCATORIA
  },
  programa?: {
    programa_id: number,
    nombre: string
  },
  criterio?: {
    criterio_id?: number,
    nombre?: string,
    tipo_de_criterio?: string,
    valor_uno?: string,
    valor_dos?: string,
    convo_progra_id?: number
  }
}

export interface ServerResponse {
  convocatoria_id: number,
  nombre: string,
  monto: number,
  fecha_inicio: Date,
  fecha_fin: Date,
  estado: ESTADO_CONVOCATORIA,
  lista_programas: ServerResponseProgram[]
}
