import courseJson from "@/data/lectures.json";

export type Exercise = [question: string, answer: string];

export type Formula = {
  label?: string;
  expr: string;
  note?: string;
};

export type LectureStat = {
  label: string;
  value: string;
};

type RawFormula = string | Formula;

type LectureBase = {
  num: number | "Bonus";
  title: string;
  block: string;
  goal: string;
  summary: string;
  concepts: string[];
  example: string;
  mistakes: string[];
  exercises: Exercise[];
};

type RawLecture = LectureBase & {
  formulas: RawFormula[];
};

export type Lecture = LectureBase & {
  formulas: Formula[];
  whyItMatters: string;
  connections: string[];
  studyChecklist: string[];
  stats: LectureStat[];
};

type RawCourse = {
  playlist_url: string;
  official_url: string;
  lectures: RawLecture[];
};

export type Course = {
  playlist_url: string;
  official_url: string;
  lectures: Lecture[];
};

const rawCourse = courseJson as RawCourse;
const totalCoreLectures = rawCourse.lectures.filter((lecture) => lecture.num !== "Bonus").length;

const blockContext: Record<string, string> = {
  Fundamentos:
    "Es la base del curso: aquí se decide si estás modelando el problema correcto antes de empezar a calcular.",
  Condicionamiento:
    "Aquí aprendes a actualizar probabilidades cuando aparece información nueva, que es justo lo que pasa en problemas reales.",
  "Variables aleatorias":
    "Este bloque convierte historias en objetos matemáticos que luego sí podemos resumir, comparar y transformar.",
  Esperanza:
    "La esperanza te da una medida estable para resumir comportamiento promedio sin enumerar cada caso a mano.",
  Distribuciones:
    "Estas familias sirven como modelos reutilizables para reconocer patrones y no reinventar cada problema desde cero.",
  "Distribuciones continuas":
    "Este tramo cambia el enfoque de contar puntos a pensar en densidades, áreas y escalas continuas.",
  Transformaciones:
    "Aquí empieza la caja de herramientas para mover distribuciones, reescalar variables y obtener nuevas cantidades de interés.",
  Repaso:
    "Sirve para coser ideas que suelen estudiarse separadas y ver cómo cooperan dentro de un mismo problema.",
  "Herramientas avanzadas":
    "Estas técnicas ahorran álgebra, revelan estructura y preparan el terreno para resultados más generales.",
  "Distribuciones multivariantes":
    "Pasamos de una sola cantidad aleatoria a sistemas completos donde importa la dependencia entre variables.",
  Dependencia:
    "Este bloque te obliga a distinguir asociación, independencia y estructura conjunta con mucho más cuidado.",
  Procesos:
    "Aquí la probabilidad entra en el tiempo: ya no solo importa qué ocurre, sino cuándo y en qué secuencia.",
  "Esperanza condicional":
    "Es uno de los puentes más importantes hacia predicción, inferencia y modelado estadístico.",
  "Teoremas límite":
    "Estas ideas explican por qué los promedios se estabilizan y por qué la Normal aparece una y otra vez.",
  "Estadística inferencial":
    "Este punto conecta la probabilidad pura con herramientas que luego se usan para estimar, contrastar y decidir.",
  "Cadenas de Markov":
    "Aquí el foco está en sistemas dinámicos donde el estado actual resume toda la información relevante para el siguiente paso.",
  Cierre:
    "Funciona como síntesis: no añade solo fórmulas, sino una forma de pensar y de conectar el curso con problemas aplicados.",
  Bonus:
    "La pieza bonus da contexto intelectual al curso y ayuda a ver por qué todo esto importa fuera del aula.",
};

function stripTrailingPeriod(value: string) {
  return value.trim().replace(/\.$/, "");
}

function lowerFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function lectureLabel(lecture: Pick<LectureBase, "num" | "title">) {
  return lecture.num === "Bonus"
    ? `la bonus track "${lecture.title}"`
    : `la clase ${lecture.num}, "${lecture.title}"`;
}

function getLectureLevel(num: Lecture["num"]) {
  if (num === "Bonus") return "Bonus";
  if (num <= 6) return "Base";
  if (num <= 18) return "Intermedio";
  if (num <= 30) return "Avanzado";
  return "Cierre";
}

function normalizeFormula(formula: RawFormula): Formula {
  if (typeof formula !== "string") {
    return {
      ...formula,
      expr: formula.expr.trim(),
      label: formula.label?.trim(),
      note: formula.note?.trim(),
    };
  }

  const cleaned = formula.trim();
  const match = cleaned.match(/^([^:]{2,36}):\s*(.+)$/);

  if (match) {
    const [, rawLabel, rawExpr] = match;
    if (/[=~<>≤≥Σ∫]/.test(rawExpr) || /\b(P|E|Var|Cov|Corr|Gamma|Beta|Pois|Bin)\b/.test(rawExpr)) {
      return {
        label: rawLabel.trim(),
        expr: rawExpr.trim(),
      };
    }
  }

  return { expr: cleaned };
}

function buildWhyItMatters(lecture: RawLecture) {
  const goal = lowerFirst(stripTrailingPeriod(lecture.goal));
  const context =
    blockContext[lecture.block] ??
    "Aporta una pieza nueva del lenguaje probabilístico y amplía el tipo de problemas que puedes modelar.";

  return `Sirve para ${goal}. ${context}`;
}

function buildConnections(lectures: RawLecture[], index: number) {
  const lecture = lectures[index];
  const previousOverall = lectures[index - 1] ?? null;
  const nextOverall = lectures[index + 1] ?? null;
  const previousInBlock =
    lectures.slice(0, index).findLast((candidate) => candidate.block === lecture.block) ?? null;
  const nextInBlock =
    lectures.slice(index + 1).find((candidate) => candidate.block === lecture.block) ?? null;

  const intro =
    previousInBlock
      ? `Se apoya en ${lectureLabel(previousInBlock)}, donde el foco era ${lowerFirst(stripTrailingPeriod(previousInBlock.goal))}.`
      : previousOverall
        ? `Llega justo después de ${lectureLabel(previousOverall)}, así que conviene recordar ${lowerFirst(stripTrailingPeriod(previousOverall.goal))}.`
        : "Abre el curso y fija el lenguaje base con el que se construyen todas las clases siguientes.";

  const outro =
    nextInBlock
      ? `Dentro del mismo bloque, prepara ${lectureLabel(nextInBlock)}, que profundiza en ${lowerFirst(stripTrailingPeriod(nextInBlock.goal))}.`
      : nextOverall
        ? `Desde aquí el curso conecta con ${lectureLabel(nextOverall)}, donde el foco pasa a ${lowerFirst(stripTrailingPeriod(nextOverall.goal))}.`
        : "Cierra el recorrido principal y deja el puente listo hacia estadística, inferencia y modelado probabilístico.";

  return [intro, outro];
}

function buildStudyChecklist(lecture: RawLecture, formulas: Formula[]) {
  const primaryFormula = formulas[0]?.expr;

  return [
    "Puedes explicar con tus palabras qué problema resuelve esta clase y por qué no basta con intuición informal.",
    lecture.concepts[0]
      ? `Reconoces sin dudar la idea central: ${stripTrailingPeriod(lecture.concepts[0])}.`
      : "Reconoces la idea central sin depender del título de la clase.",
    primaryFormula
      ? `Sabes cuándo usar esta fórmula o identidad clave: ${primaryFormula}`
      : "Puedes traducir la intuición de la clase a una regla o procedimiento concreto.",
    lecture.mistakes[0]
      ? `Revisas este error típico antes de cerrar: ${stripTrailingPeriod(lecture.mistakes[0])}.`
      : "Compruebas el error típico antes de dar por buena una solución.",
    lecture.exercises.length > 0
      ? "Resuelves al menos un ejercicio de esta ficha sin abrir la respuesta en el primer intento."
      : "Creas un ejemplo propio para verificar que entendiste el mecanismo principal.",
  ];
}

function buildStats(lecture: RawLecture, formulas: Formula[]): LectureStat[] {
  return [
    { label: "Bloque", value: lecture.block },
    { label: "Nivel", value: getLectureLevel(lecture.num) },
    { label: "Conceptos", value: String(lecture.concepts.length) },
    { label: "Fórmulas", value: String(formulas.length) },
    { label: "Ejercicios", value: String(lecture.exercises.length) },
    {
      label: "Posición",
      value: lecture.num === "Bonus" ? "Bonus" : `${lecture.num}/${totalCoreLectures}`,
    },
  ];
}

function enrichLecture(lecture: RawLecture, index: number, lectures: RawLecture[]): Lecture {
  const formulas = lecture.formulas.map(normalizeFormula);

  return {
    ...lecture,
    formulas,
    whyItMatters: buildWhyItMatters(lecture),
    connections: buildConnections(lectures, index),
    studyChecklist: buildStudyChecklist(lecture, formulas),
    stats: buildStats(lecture, formulas),
  };
}

export const course: Course = {
  ...rawCourse,
  lectures: rawCourse.lectures.map(enrichLecture),
};

export function slugifyLecture(lecture: Pick<LectureBase, "num" | "title">) {
  const prefix = String(lecture.num).toLowerCase();
  const title = lecture.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return `${prefix}-${title}`;
}

export const lectures = course.lectures.map((lecture) => ({
  ...lecture,
  slug: slugifyLecture(lecture),
}));

export type LectureWithSlug = (typeof lectures)[number];

export const blocks = Array.from(new Set(lectures.map((lecture) => lecture.block)));

export function getLectureBySlug(slug: string) {
  return lectures.find((lecture) => lecture.slug === slug);
}

export function getLectureNavigation(slug: string) {
  const index = lectures.findIndex((lecture) => lecture.slug === slug);

  return {
    previous: index > 0 ? lectures[index - 1] : null,
    next: index >= 0 && index < lectures.length - 1 ? lectures[index + 1] : null,
  };
}

export function getBlockStats(block: string) {
  const blockLectures = lectures.filter((lecture) => lecture.block === block);

  return {
    count: blockLectures.length,
    first: blockLectures[0],
    last: blockLectures[blockLectures.length - 1],
  };
}
