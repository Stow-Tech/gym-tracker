// Plan de 4 días (~1 hora por sesión). Lun/Mar/Jue son los días clave;
// el viernes es opcional ("cuando pueda"), pero es el que da la 2ª sesión semanal
// a pecho, espalda, hombros y brazos.
// Brazos y antebrazos tienen trabajo en los 4 días.
//
// IMPORTANTE: los nombres de ejercicio son la llave del historial. No los renombres
// o se pierde el "última vez" y el PR de ese ejercicio.

// Fecha desde la que aplica este plan. Las sesiones anteriores usan legacyPlan
// para mostrar sus nombres de día correctos en Progress.
export const NEW_PLAN_START = '2026-11-05'

export const workoutPlan = {
  mon: {
    label: 'Monday', focus: 'Upper Body A — Chest / Back / Shoulders / Triceps',
    sections: [
      { title: 'Chest', exercises: [
        { name: 'Barbell Bench Press', sets: 3, reps: '6–8', rest: '2–3 min' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '8–12', rest: '2 min' },
      ]},
      { title: 'Back', exercises: [
        { name: 'Lat Pulldown', sets: 3, reps: '8–12', rest: '90s' },
      ]},
      { title: 'Shoulders', exercises: [
        { name: 'Seated Military Press', sets: 3, reps: '8–10', rest: '2 min' },
      ]},
      { title: 'Triceps', exercises: [
        { name: 'Rope Pushdown', sets: 2, reps: '10–15', rest: '60–90s' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '10–12', rest: '60–90s' },
      ]},
    ],
  },
  tue: {
    label: 'Tuesday', focus: 'Pull — Back / Biceps / Forearms',
    sections: [
      { title: 'Back', exercises: [
        { name: 'Pull-Ups or Lat Pulldown', sets: 3, reps: '8–12', rest: '2 min' },
        { name: 'Heavy Barbell Row', sets: 3, reps: '8–10', rest: '2–3 min' },
      ]},
      { title: 'Biceps', exercises: [
        { name: 'Heavy Barbell Curl', sets: 3, reps: '8–10', rest: '90s' },
        { name: 'Incline Dumbbell Curl', sets: 2, reps: '10–12', rest: '60–90s' },
      ]},
      { title: 'Forearms', exercises: [
        { name: 'Reverse Curl', sets: 2, reps: '12–15', rest: '60s' },
        { name: 'Wrist Curl', sets: 3, reps: '15–20', rest: '60s' },
        { name: 'Dead Hang', sets: 2, reps: 'Max seg', rest: '60s', timed: true },
      ]},
    ],
  },
  thu: {
    label: 'Thursday', focus: 'Legs + Arm Finisher — Legs / Abs / Arms',
    sections: [
      { title: 'Quads & Glutes', exercises: [
        { name: 'Leg Press', sets: 3, reps: '10–12', rest: '2–3 min' },
        { name: 'Hack Squat', sets: 3, reps: '10–12', rest: '2–3 min' },
      ]},
      { title: 'Hamstrings & Calves', exercises: [
        { name: 'Seated Leg Curl', sets: 3, reps: '10–12', rest: '90s' },
        { name: 'Calf Raises', sets: 3, reps: '12–15', rest: '60–90s' },
      ]},
      { title: 'Arm Finisher (superserie: curl + skull, sin descanso entre ellos)', exercises: [
        { name: 'Preacher Curl', sets: 3, reps: '10–12', rest: '60s tras el par' },
        { name: 'Skull Crushers', sets: 3, reps: '10–12', rest: '60s tras el par' },
        { name: 'Plate Pinch Hold', sets: 2, reps: '30 seg', rest: '45s', timed: true },
      ]},
      { title: 'ABS', exercises: [
        { name: 'Hanging Knee Raises', sets: 3, reps: '12–15', rest: '60s' },
      ]},
    ],
  },
  fri: {
    label: 'Friday', optional: true, focus: 'Upper Body B — Shoulders / Back / Chest / Arms',
    sections: [
      { title: 'Shoulders', exercises: [
        { name: 'Seated Military Press', sets: 3, reps: '8–10', rest: '2 min' },
        { name: 'Dumbbell Lateral Raises', sets: 2, reps: '12–15', rest: '60–90s' },
      ]},
      { title: 'Back', exercises: [
        { name: 'Chest-Supported Row', sets: 3, reps: '8–12', rest: '2 min' },
      ]},
      { title: 'Chest', exercises: [
        { name: 'Incline Dumbbell Press', sets: 3, reps: '8–12', rest: '2 min' },
      ]},
      { title: 'Arms', exercises: [
        { name: 'Overhead Tricep Extension', sets: 3, reps: '10–12', rest: '60–90s' },
        { name: 'Hammer Curl', sets: 2, reps: '10–12', rest: '60–90s' },
        { name: 'Wrist Curl', sets: 2, reps: '15–20', rest: '60s' },
      ]},
    ],
  },
}

export const DAY_KEYS = ['mon', 'tue', 'thu', 'fri']

// Día de la semana (Date.getDay()) de cada día del plan
export const DAY_NUMBER = { mon: 1, tue: 2, thu: 4, fri: 5 }

// Solo etiquetas, para mostrar sesiones viejas (antes de NEW_PLAN_START) tal como se entrenaron.
export const legacyPlan = {
  mon: { label: 'Monday', focus: 'Push (Heavy) — Chest / Shoulders / Triceps' },
  tue: { label: 'Tuesday', focus: 'Pull (Heavy) — Back / Biceps / Forearms' },
  wed: { label: 'Wednesday', focus: 'Legs + Light ABS' },
  thu: { label: 'Thursday', focus: 'Push (Hypertrophy) — Chest / Shoulders / Triceps' },
  fri: { label: 'Friday', focus: 'Pull + Arm Specialization' },
  sat: { label: 'Saturday', focus: 'Active Recovery' },
}

export function dayInfo(dayKey, date) {
  if (date && date < NEW_PLAN_START) return legacyPlan[dayKey]
  return workoutPlan[dayKey] || legacyPlan[dayKey]
}
