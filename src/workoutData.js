export const workoutPlan = {
  mon: {
    label: 'Monday', focus: 'Push — Chest / Shoulders / Triceps',
    sections: [
      { title: 'Chest', exercises: [
        { name: 'Press de Pecho con Barra', sets: 4, reps: 8, rest: '90s' },
        { name: 'Cristos con Mancuerna Inclinado', sets: 3, reps: 12, rest: '75s' },
      ]},
      { title: 'Shoulders', exercises: [
        { name: 'Press Militar Sentado', sets: 3, reps: 10, rest: '90s' },
        { name: 'Elevaciones Laterales con Mancuerna', sets: 3, reps: 15, rest: '60s' },
        { name: 'Face Pull en Polea', sets: 3, reps: 15, rest: '60s' },
      ]},
      { title: 'Triceps', exercises: [
        { name: 'Extensión Tríceps Sobre Cabeza', sets: 3, reps: 12, rest: '75s' },
        { name: 'Jalón de Tríceps en Polea', sets: 3, reps: 12, rest: '60s' },
      ]},
    ],
  },
  tue: {
    label: 'Tuesday', focus: 'Pull — Back / Biceps / Forearms',
    sections: [
      { title: 'Back', exercises: [
        { name: 'Jalón / Dominadas', sets: 4, reps: 8, rest: '90s' },
        { name: 'Remo Pesado', sets: 4, reps: 8, rest: '90s' },
        { name: 'Remo en Polea Baja', sets: 3, reps: 12, rest: '75s' },
      ]},
      { title: 'Biceps', exercises: [
        { name: 'Curl Bíceps con Barra', sets: 3, reps: 10, rest: '75s' },
        { name: 'Curl de Martillo con Mancuerna', sets: 3, reps: 12, rest: '60s' },
      ]},
      { title: 'Forearms', exercises: [
        { name: 'Curl de Muñeca con Barra (palms up)', sets: 3, reps: 15, rest: '45s' },
        { name: 'Curl de Muñeca Reverso (palms down)', sets: 3, reps: 15, rest: '45s' },
        { name: 'Dead Hang en Barra', sets: 3, reps: 'Máx tiempo', rest: '60s' },
      ]},
    ],
  },
  wed: {
    label: 'Wednesday', focus: 'Core + Cardio — Aire Libre',
    sections: [
      { title: 'Cardio', exercises: [
        { name: 'Caminata rápida / Trote', sets: 1, reps: '10 min', rest: '—' },
      ]},
      { title: 'Core', exercises: [
        { name: 'Plancha Frontal', sets: 3, reps: '45s', rest: '30s' },
        { name: 'Crunch de Bicicleta', sets: 3, reps: 20, rest: '45s' },
        { name: 'Mountain Climbers', sets: 3, reps: 20, rest: '45s' },
        { name: 'Elevación de Piernas en Piso', sets: 3, reps: 12, rest: '45s' },
        { name: 'Sentadillas con Peso Corporal', sets: 3, reps: 15, rest: '60s' },
      ]},
      { title: 'Cierre', exercises: [
        { name: 'Trote suave / Caminata', sets: 1, reps: '10 min', rest: '—' },
      ]},
    ],
  },
  thu: {
    label: 'Thursday', focus: 'Legs',
    sections: [
      { title: 'Quads & Glutes', exercises: [
        { name: 'Leg Press 45°', sets: 3, reps: 12, rest: '90s' },
        { name: 'Hack Squat', sets: 3, reps: 12, rest: '90s' },
        { name: 'Desplante con Barra', sets: 3, reps: 9, rest: '75s' },
      ]},
      { title: 'Hamstrings & Glutes', exercises: [
        { name: 'Gluteo en Máquina', sets: 3, reps: 12, rest: '60s' },
        { name: 'Seated Leg Curl', sets: 3, reps: 13, rest: '80s' },
      ]},
      { title: 'Calves & Abductors', exercises: [
        { name: 'Máquina Abductora', sets: 3, reps: 12, rest: '75s' },
        { name: 'Elevación de Gemelos (Calf Raise)', sets: 4, reps: 15, rest: '60s' },
      ]},
    ],
  },
  fri: {
    label: 'Friday', focus: 'Arms + ABS',
    sections: [
      { title: 'Biceps', exercises: [
        { name: 'Curl con Mancuernas Inclinado', sets: 3, reps: 12, rest: '75s' },
        { name: 'Curl de Concentración', sets: 3, reps: 12, rest: '60s' },
      ]},
      { title: 'Triceps', exercises: [
        { name: 'Fondos en Paralelas', sets: 3, reps: 10, rest: '75s' },
        { name: 'Extensión de Tríceps con Cuerda', sets: 3, reps: 15, rest: '60s' },
      ]},
      { title: 'Forearms', exercises: [
        { name: 'Curl de Muñeca con Mancuernas', sets: 3, reps: 20, rest: '45s' },
        { name: 'Plate Pinch (disco con dedos)', sets: 3, reps: '30s', rest: '45s' },
        { name: 'Dead Hang en Barra', sets: 3, reps: 'Máx tiempo', rest: '60s' },
      ]},
      { title: 'ABS', exercises: [
        { name: 'Crunch en Máquina', sets: 3, reps: 15, rest: '45s' },
        { name: 'Crunch de Bicicleta', sets: 3, reps: 20, rest: '45s' },
        { name: 'Plancha Frontal', sets: 3, reps: '45s', rest: '30s' },
        { name: 'Elevación de Piernas Colgado', sets: 3, reps: 12, rest: '45s' },
      ]},
    ],
  },
  sat: {
    label: 'Saturday', focus: 'Cardio + ABS — Aire Libre',
    sections: [
      { title: 'HIIT Cardio', exercises: [
        { name: 'HIIT Caminata (1 min rápido / 1 min normal)', sets: 10, reps: '2 min', rest: '—' },
      ]},
      { title: 'ABS', exercises: [
        { name: 'Plancha Frontal', sets: 4, reps: '45s', rest: '30s' },
        { name: 'Crunch de Bicicleta', sets: 4, reps: 20, rest: '45s' },
        { name: 'Elevación de Piernas en Piso', sets: 4, reps: 12, rest: '45s' },
        { name: 'Mountain Climbers', sets: 3, reps: 20, rest: '45s' },
        { name: 'Dead Bug', sets: 3, reps: '10 c/lado', rest: '45s' },
      ]},
      { title: 'Cierre', exercises: [
        { name: 'Trote suave / Caminata', sets: 1, reps: '10 min', rest: '—' },
      ]},
    ],
  },
}

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']