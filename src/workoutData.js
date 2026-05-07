export const workoutPlan = {
  mon: {
    label: 'Monday', focus: 'Push (Heavy) — Chest / Shoulders / Triceps',
    sections: [
      { title: 'Chest', exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '6–8', rest: '90s' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: '75s' },
      ]},
      { title: 'Shoulders', exercises: [
        { name: 'Seated Military Press', sets: 3, reps: '8–10', rest: '90s' },
        { name: 'Dumbbell Lateral Raises', sets: 4, reps: 15, rest: '60s' },
      ]},
      { title: 'Triceps', exercises: [
        { name: 'Close-Grip Bench Press', sets: 3, reps: 8, rest: '90s' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: 12, rest: '75s' },
        { name: 'Rope Pushdown', sets: 3, reps: 12, rest: '60s' },
      ]},
    ],
  },
  tue: {
    label: 'Tuesday', focus: 'Pull (Heavy) — Back / Biceps / Forearms',
    sections: [
      { title: 'Back', exercises: [
        { name: 'Pull-Ups or Lat Pulldown', sets: 4, reps: 8, rest: '90s' },
        { name: 'Heavy Barbell Row', sets: 4, reps: 8, rest: '90s' },
        { name: 'Cable Row', sets: 3, reps: 12, rest: '75s' },
      ]},
      { title: 'Biceps', exercises: [
        { name: 'Heavy Barbell Curl', sets: 4, reps: '8–10', rest: '75s' },
        { name: 'Hammer Curl', sets: 3, reps: 12, rest: '60s' },
      ]},
      { title: 'Forearms', exercises: [
        { name: 'Reverse Curl', sets: 3, reps: 12, rest: '45s' },
        { name: 'Wrist Curl', sets: 3, reps: 15, rest: '45s' },
        { name: 'Dead Hang', sets: 3, reps: 'Max time', rest: '60s' },
      ]},
    ],
  },
  wed: {
    label: 'Wednesday', focus: 'Legs + Light ABS',
    sections: [
      { title: 'Quads & Glutes', exercises: [
        { name: 'Leg Press', sets: 4, reps: 10, rest: '90s' },
        { name: 'Hack Squat', sets: 3, reps: 10, rest: '90s' },
        { name: 'Walking Lunges', sets: 3, reps: 10, rest: '75s' },
      ]},
      { title: 'Hamstrings & Calves', exercises: [
        { name: 'Seated Leg Curl', sets: 3, reps: 12, rest: '75s' },
        { name: 'Calf Raises', sets: 4, reps: 15, rest: '60s' },
      ]},
      { title: 'ABS', exercises: [
        { name: 'Hanging Knee Raises', sets: 3, reps: 15, rest: '45s' },
        { name: 'Front Plank', sets: 3, reps: '45s', rest: '30s' },
      ]},
    ],
  },
  thu: {
    label: 'Thursday', focus: 'Push (Hypertrophy) — Chest / Shoulders / Triceps',
    sections: [
      { title: 'Chest', exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: 12, rest: '75s' },
        { name: 'Machine Chest Press', sets: 3, reps: 12, rest: '75s' },
      ]},
      { title: 'Shoulders', exercises: [
        { name: 'Arnold Press', sets: 3, reps: 12, rest: '75s' },
        { name: 'Cable Lateral Raises', sets: 4, reps: 15, rest: '60s' },
      ]},
      { title: 'Triceps', exercises: [
        { name: 'Skull Crushers', sets: 3, reps: 12, rest: '75s' },
        { name: 'Rope Pushdown', sets: 4, reps: 15, rest: '60s' },
        { name: 'Bench Dips', sets: 3, reps: 'Failure', rest: '60s' },
      ]},
    ],
  },
  fri: {
    label: 'Friday', focus: 'Pull + Arm Specialization',
    sections: [
      { title: 'Back', exercises: [
        { name: 'Lat Pulldown', sets: 3, reps: 12, rest: '75s' },
        { name: 'Chest-Supported Row', sets: 3, reps: 12, rest: '75s' },
      ]},
      { title: 'Biceps', exercises: [
        { name: 'Incline Dumbbell Curl', sets: 4, reps: 12, rest: '75s' },
        { name: 'Preacher Curl', sets: 3, reps: 12, rest: '75s' },
        { name: 'Hammer Curl', sets: 4, reps: 10, rest: '60s' },
      ]},
      { title: 'Forearms', exercises: [
        { name: 'Reverse Curl', sets: 3, reps: 15, rest: '45s' },
        { name: 'Wrist Curl', sets: 3, reps: 20, rest: '45s' },
        { name: 'Plate Pinch Hold', sets: 3, reps: '30s', rest: '45s' },
        { name: 'Dead Hang', sets: 3, reps: 'Max time', rest: '60s' },
      ]},
    ],
  },
  sat: {
    label: 'Saturday', focus: 'Active Recovery',
    sections: [
      { title: 'Active Recovery', exercises: [
        { name: 'Walking', sets: 1, reps: '—', rest: '—' },
        { name: 'Salsa', sets: 1, reps: '—', rest: '—' },
        { name: 'Mobility Work', sets: 1, reps: '—', rest: '—' },
        { name: 'Light Cardio', sets: 1, reps: '—', rest: '—' },
        { name: 'Stretching', sets: 1, reps: '—', rest: '—' },
      ]},
    ],
  },
}

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']