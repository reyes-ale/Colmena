/** Texto del "Acuerdo Digital" — compartido entre el modal que lo muestra
 * en pantalla y el generador de PDF, para no mantener el mismo texto en
 * dos lugares. */

export const ACUERDO_TITULO = "ACUERDO DIGITAL";
export const ACUERDO_SUBTITULO = "Colmena · Acuerdo de colaboración entre Cliente y Creativo";

export const ACUERDO_INTRO =
  "Este acuerdo establece las condiciones bajo las cuales se desarrollará el proyecto seleccionado dentro de Colmena. Ambas partes deberán revisar la información del proyecto y confirmar su aceptación antes de comenzar.";

export interface AcuerdoSeccion {
  titulo: string;
  texto: string;
}

export const ACUERDO_SECCIONES: AcuerdoSeccion[] = [
  {
    titulo: "Sobre el proyecto",
    texto:
      "El creativo realizará los servicios y entregables descritos en la propuesta seleccionada por el cliente, de acuerdo con las características, alcance, precio y fecha de entrega establecidos en el proyecto.",
  },
  {
    titulo: "Compromiso del creativo",
    texto:
      "El creativo se compromete a desarrollar y entregar el trabajo acordado dentro del plazo establecido, manteniendo comunicación con el cliente durante el proceso y realizando las modificaciones previamente acordadas.",
  },
  {
    titulo: "Compromiso del cliente",
    texto:
      "El cliente se compromete a proporcionar la información y recursos necesarios para el desarrollo del proyecto, respetar las condiciones acordadas y realizar el pago correspondiente según lo establecido entre ambas partes.",
  },
  {
    titulo: "Cambios y revisiones",
    texto:
      "Las revisiones incluidas serán aquellas especificadas en la propuesta seleccionada. Cualquier cambio adicional o modificación del alcance original deberá ser acordado entre el cliente y el creativo.",
  },
  {
    titulo: "Entrega del proyecto",
    texto:
      "Una vez realizada la entrega, el cliente podrá revisar el trabajo y solicitar las modificaciones contempladas en el acuerdo. Cuando ambas partes consideren cumplidos los compromisos establecidos, el proyecto podrá marcarse como completado.",
  },
  {
    titulo: "Cancelación",
    texto:
      "Si alguna de las partes desea cancelar el proyecto, deberá comunicarlo a la otra parte y llegar a un acuerdo respecto al estado del trabajo realizado y las condiciones pendientes.",
  },
  {
    titulo: "Aceptación",
    texto:
      "La aceptación digital de este documento confirma que ambas partes han revisado y comprendido las condiciones relacionadas con el proyecto y manifiestan su conformidad con lo establecido.",
  },
];

export const ACUERDO_CIERRE = "Este acuerdo quedará registrado en Colmena como constancia de la aceptación de ambas partes.";
