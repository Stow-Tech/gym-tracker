// Plan de 4 días (1 hora por sesión). Lun/Mar/Jue son los días clave;
// el viernes es opcional ("cuando pueda"). Brazos y antebrazos van en los 3 días clave,
// así que se entrenan al menos 2 veces por semana aunque se salte el viernes.
//
// IMPORTANTE: los nombres de ejercicio son la llave del historial. No los renombres
// o se pierde el "última vez" y el PR de ese ejercicio.

// Fecha desde la que aplica este plan. Las sesiones anteriores usan legacyPlan
// para mostrar sus nombres de día correctos en Progress.
export const NEW_PLAN_START = '2026-11-05'

export const workoutPlan = {
  mon: {
    label: 'Monday', focus: 'Push (Heavy) — Chest / Shoulders / Triceps',
    sections: [
      { title: 'Chest', exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '6–8', rest: '90s' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '8–10', rest: '75s' },
      ]},
      { title: 'Shoulders', exercises: [
        { name: 'Seated Military Press', sets: 3, reps: '8–10', rest: '90s' },
        { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12–15', rest: '60s' },
      ]},
      { title: 'Triceps (prioridad)', exercises: [
        { name: 'Close-Grip Bench Press', sets: 3, reps: 8, rest: '90s' },
        { name: 'Overhead Tricep Extension', sets: 4, reps: '10–12', rest: '75s' },
        { name: 'Rope Pushdown', sets: 3, reps: '12–15', rest: '60s' },
      ]},
    ],
  },
  tue: {
    label: 'Tuesday', focus: 'Pull (Heavy) — Back / Biceps / Forearms',
    sections: [
      { title: 'Back', exercises: [
        { name: 'Pull-Ups or Lat Pulldown', sets: 4, reps: 8, rest: '90s' },
        { name: 'Heavy Barbell Row', sets: 3, reps: '8–10', rest: '90s' },
      ]},
      { title: 'Biceps (prioridad)', exercises: [
        { name: 'Heavy Barbell Curl', sets: 4, reps: '8–10', rest: '75s' },
        { name: 'Incline Dumbbell Curl', sets: 3, reps: '10–12', rest: '60s' },
        { name: 'Hammer Curl', sets: 3, reps: '10–12', rest: '60s' },
      ]},
      { title: 'Forearms (prioridad)', exercises: [
        { name: 'Reverse Curl', sets: 3, reps: 12, rest: '45s' },
        { name: 'Wrist Curl', sets: 3, reps: '15–20', rest: '45s' },
        { name: 'Dead Hang', sets: 2, reps: 'Max seg', rest: '60s', timed: true },
      ]},
    ],
  },
  thu: {
    label: 'Thursday', focus: 'Legs + Arm Finisher',
    sections: [
      { title: 'Quads & Glutes', exercises: [
        { name: 'Leg Press', sets: 4, reps: 10, rest: '90s' },
        { name: 'Hack Squat', sets: 3, reps: 10, rest: '90s' },
      ]},
      { title: 'Hamstrings & Calves', exercises: [
        { name: 'Seated Leg Curl', sets: 3, reps: 12, rest: '75s' },
        { name: 'Calf Raises', sets: 3, reps: 15, rest: '60s' },
      ]},
      { title: 'Arm Finisher (superserie)', exercises: [
        { name: 'Preacher Curl', sets: 3, reps: '10–12', rest: '45s' },
        { name: 'Skull Crushers', sets: 3, reps: '10–12', rest: '45s' },
        { name: 'Plate Pinch Hold', sets: 2, reps: '30 seg', rest: '45s', timed: true },
      ]},
      { title: 'ABS', exercises: [
        { name: 'Hanging Knee Raises', sets: 3, reps: 15, rest: '45s' },
      ]},
    ],
  },
  fri: {
    label: 'Friday', optional: true, focus: 'Arms & Forearms Specialization',
    sections: [
      { title: 'Biceps', exercises: [
        { name: 'Preacher Curl', sets: 4, reps: '10–12', rest: '60s' },
        { name: 'Hammer Curl', sets: 3, reps: 10, rest: '60s' },
      ]},
      { title: 'Triceps', exercises: [
        { name: 'Skull Crushers', sets: 4, reps: '10–12', rest: '60s' },
        { name: 'Rope Pushdown', sets: 3, reps: '12–15', rest: '60s' },
      ]},
      { title: 'Forearms', exercises: [
        { name: 'Reverse Curl', sets: 3, reps: 15, rest: '45s' },
        { name: 'Wrist Curl', sets: 3, reps: 20, rest: '45s' },
        { name: 'Plate Pinch Hold', sets: 2, reps: '30 seg', rest: '45s', timed: true },
        { name: 'Dead Hang', sets: 2, reps: 'Max seg', rest: '60s', timed: true },
      ]},
      { title: 'Shoulders', exercises: [
        { name: 'Cable Lateral Raises', sets: 3, reps: 15, rest: '45s' },
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
