export const COURSE_IMAGE_ASPECTS = ["16:9", "4:5"] as const;

export type CourseImageAspect = (typeof COURSE_IMAGE_ASPECTS)[number];

export const DEFAULT_COURSE_IMAGE_ASPECT: CourseImageAspect = "16:9";

export function normalizeCourseImageAspect(value?: string | null): CourseImageAspect {
  return value === "4:5" ? "4:5" : DEFAULT_COURSE_IMAGE_ASPECT;
}

export function getCourseImageAspectClass(value?: string | null): string {
  return normalizeCourseImageAspect(value) === "4:5" ? "aspect-[4/5]" : "aspect-[16/9]";
}
