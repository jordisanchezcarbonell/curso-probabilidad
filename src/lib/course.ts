import courseJson from "@/data/lectures.json";

export type Exercise = [question: string, answer: string];

export type Lecture = {
  num: number | "Bonus";
  title: string;
  block: string;
  goal: string;
  summary: string;
  concepts: string[];
  formulas: string[];
  example: string;
  mistakes: string[];
  exercises: Exercise[];
};

export type Course = {
  playlist_url: string;
  official_url: string;
  lectures: Lecture[];
};

export const course = courseJson as Course;

export function slugifyLecture(lecture: Lecture) {
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
