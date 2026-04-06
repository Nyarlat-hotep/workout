export const WORKOUT = [
  {
    day: 1,
    label: 'PUSH',
    variants: {
      A: {
        blocks: [
          {
            id: 'push-a-strength',
            name: 'STRENGTH BLOCK',
            type: 'strength',
            exercises: [
              {
                name: 'Dumbbell Floor Press',
                sets: 4, reps: '5',
                notes: 'Heavy 40–50 lb · focus on chest squeeze at top',
              },
              {
                name: 'Pike Push-Up',
                sets: 3, reps: '6',
                notes: '3 sec eccentric · hips high · elbows track back',
              },
            ],
          },
          {
            id: 'push-a-hypertrophy',
            name: 'HYPERTROPHY BLOCK',
            type: 'hypertrophy',
            exercises: [
              {
                name: 'Incline DB Press',
                sets: 3, reps: '10–12',
                notes: 'Feet propped on bench · elbows 45° to torso',
              },
              {
                name: 'Lateral Raise',
                sets: 3, reps: '15',
                notes: 'Slight forward lean · lead with elbows · no shrug',
              },
              {
                name: 'Dips',
                sets: 3, reps: '12–15',
                notes: 'Slight forward lean for chest bias · full lockout',
              },
              {
                name: 'DB Overhead Press',
                sets: 3, reps: '10',
                notes: 'Standing · brace core · neutral wrists · full ROM',
              },
            ],
          },
          {
            id: 'push-a-mobility',
            name: 'MOBILITY FINISHER',
            type: 'mobility',
            exercises: [
              {
                name: 'Shoulder CARs',
                sets: 2, reps: '5/side',
                notes: 'Slow full-range rotations · brace everything else',
              },
              {
                name: 'Wall Slide',
                sets: 3, reps: '10',
                notes: 'Back flat against wall · arms slide overhead',
              },
              {
                name: 'Doorway Pec Stretch',
                sets: 2, reps: '45s',
                notes: 'Elbow at 90° · step through slowly · no pain',
              },
            ],
          },
        ],
      },
      B: {
        blocks: [
          {
            id: 'push-b-strength',
            name: 'STRENGTH BLOCK',
            type: 'strength',
            exercises: [
              {
                name: 'Tempo Dips',
                sets: 4, reps: '5',
                notes: '5 sec eccentric · 1 sec pause at bottom · press up controlled',
                bodyweight: true,
              },
              {
                name: 'DB Push Press',
                sets: 3, reps: '5',
                notes: 'Slight dip then drive overhead · lock out at top',
              },
            ],
          },
          {
            id: 'push-b-hypertrophy',
            name: 'HYPERTROPHY BLOCK',
            type: 'hypertrophy',
            exercises: [
              {
                name: 'DB Chest Fly',
                sets: 3, reps: '12',
                notes: 'Lying on floor · slight bend in elbows · wide arc',
              },
              {
                name: 'DB Front Raise',
                sets: 3, reps: '12',
                notes: 'Alternating · thumb up · stop at shoulder height',
              },
              {
                name: 'Close-Grip Push-Up',
                sets: 3, reps: '15',
                notes: 'Hands under chest · elbows stay tight to ribs',
              },
              {
                name: 'DB Skull Crusher',
                sets: 3, reps: '12',
                notes: 'Lying on floor · lower to temples · elbows fixed',
              },
            ],
          },
          {
            id: 'push-b-mobility',
            name: 'MOBILITY FINISHER',
            type: 'mobility',
            exercises: [
              {
                name: 'Shoulder CARs',
                sets: 2, reps: '5/side',
                notes: 'Slow full-range rotations · brace everything else',
              },
              {
                name: 'Chest-to-Wall Stretch',
                sets: 2, reps: '45s',
                notes: 'Arm at 90° on wall · rotate chest away · breathe',
              },
              {
                name: 'Wrist Flexor Stretch',
                sets: 2, reps: '30s/side',
                notes: 'Arm extended · pull fingers back gently · hold',
              },
            ],
          },
        ],
      },
    },
  },

  {
    day: 2,
    label: 'PULL',
    variants: {
      A: {
        blocks: [
          {
            id: 'pull-a-strength',
            name: 'STRENGTH BLOCK',
            type: 'strength',
            exercises: [
              {
                name: 'Tempo Pull-Up',
                sets: 4, reps: '5',
                notes: '5 sec eccentric · 1 sec dead hang · pull explosively',
                bodyweight: true,
              },
              {
                name: 'Chest-to-Bar Pull-Up',
                sets: 3, reps: 'max',
                notes: 'Pull until sternum touches bar · controlled descent',
              },
            ],
          },
          {
            id: 'pull-a-hypertrophy',
            name: 'HYPERTROPHY BLOCK',
            type: 'hypertrophy',
            exercises: [
              {
                name: 'Single-Arm DB Row',
                sets: 3, reps: '12/side',
                notes: 'Brace on bench · elbow past torso · squeeze at top',
              },
              {
                name: 'DB High Pull',
                sets: 3, reps: '15',
                notes: 'Elbows high and wide · explosive pull · control down',
              },
              {
                name: 'Hammer Curl',
                sets: 3, reps: '12',
                notes: 'Neutral grip · no swing · full extension at bottom',
              },
              {
                name: 'DB Curl',
                sets: 3, reps: '10',
                notes: 'Supinate at top · slow eccentric · don\'t swing',
              },
            ],
          },
          {
            id: 'pull-a-mobility',
            name: 'MOBILITY FINISHER',
            type: 'mobility',
            exercises: [
              {
                name: 'Thoracic Extension over Bench',
                sets: 2, reps: '60s',
                notes: 'Mid-back on bench edge · arms behind head · relax',
              },
              {
                name: 'Thread the Needle',
                sets: 2, reps: '8/side',
                notes: 'On all-fours · reach under and rotate fully',
              },
              {
                name: 'Dead Hang',
                sets: 3, reps: '30–45s',
                notes: 'Full passive hang · breathe · let shoulders open',
              },
            ],
          },
        ],
      },
      B: {
        blocks: [
          {
            id: 'pull-b-strength',
            name: 'STRENGTH BLOCK',
            type: 'strength',
            exercises: [
              {
                name: 'L-Sit Chin-Up',
                sets: 4, reps: '5',
                notes: 'Legs extended parallel to floor · supinated grip · full ROM',
                bodyweight: true,
              },
              {
                name: 'Archer Pull-Up',
                sets: 3, reps: 'max',
                notes: 'One arm pulls · other arm guides · alternate sides',
              },
            ],
          },
          {
            id: 'pull-b-hypertrophy',
            name: 'HYPERTROPHY BLOCK',
            type: 'hypertrophy',
            exercises: [
              {
                name: 'Bent-Over DB Row',
                sets: 3, reps: '12',
                notes: 'Hinge at hips · chest parallel to floor · row both',
              },
              {
                name: 'DB Rear Delt Fly',
                sets: 3, reps: '15',
                notes: 'Face down on bench · slight bend in elbows · squeeze',
              },
              {
                name: 'Zottman Curl',
                sets: 3, reps: '12',
                notes: 'Curl up supinated · rotate at top · lower pronated',
              },
              {
                name: 'Spider Curl',
                sets: 3, reps: '10',
                notes: 'Face down on bench · arms hang · curl strict · no swing',
              },
            ],
          },
          {
            id: 'pull-b-mobility',
            name: 'MOBILITY FINISHER',
            type: 'mobility',
            exercises: [
              {
                name: 'Thoracic Extension over Bench',
                sets: 2, reps: '60s',
                notes: 'Mid-back on bench edge · arms behind head · relax',
              },
              {
                name: 'Cat-Cow',
                sets: 2, reps: '10',
                notes: 'On all-fours · slow inhale arch · exhale round · breathe',
              },
              {
                name: 'Dead Hang',
                sets: 3, reps: '30–45s',
                notes: 'Full passive hang · breathe · let shoulders open',
              },
            ],
          },
        ],
      },
    },
  },

  {
    day: 3,
    label: 'LEGS',
    variants: {
      A: {
        blocks: [
          {
            id: 'legs-a-strength',
            name: 'STRENGTH BLOCK',
            type: 'strength',
            exercises: [
              {
                name: 'Bulgarian Split Squat',
                sets: 4, reps: '6/side',
                notes: 'Heavy DBs · rear foot on bench · torso upright',
              },
              {
                name: 'Romanian Deadlift',
                sets: 4, reps: '8',
                notes: '45–50 lb DBs · hinge at hips · feel hamstring stretch',
              },
            ],
          },
          {
            id: 'legs-a-hypertrophy',
            name: 'HYPERTROPHY BLOCK',
            type: 'hypertrophy',
            exercises: [
              {
                name: 'DB Goblet Squat',
                sets: 3, reps: '15',
                notes: 'DB at chest · elbows track knees · full depth',
              },
              {
                name: 'DB Reverse Lunge',
                sets: 3, reps: '12/side',
                notes: 'Step back · front knee tracks foot · drive through heel to stand',
              },
              {
                name: 'Single-Leg Calf Raise',
                sets: 3, reps: '15/side',
                notes: 'Stand on edge of step · full range · slow eccentric · hold DB for load',
              },
            ],
          },
          {
            id: 'legs-a-core',
            name: 'CORE + MOBILITY',
            type: 'mobility',
            exercises: [
              {
                name: 'Dead Bug',
                sets: 3, reps: '8/side',
                notes: 'Low back glued to floor · slow · full extension',
                bodyweight: true,
              },
              {
                name: 'Copenhagen Plank',
                sets: 3, reps: '20–30s/side',
                notes: 'Foot on bench · hip stays level · don\'t sag',
                bodyweight: true,
              },
              {
                name: '90/90 Hip Stretch',
                sets: 2, reps: '60s/side',
                notes: 'Both knees at 90° · sit tall · feel outer hip',
              },
              {
                name: 'Deep Squat Hold',
                sets: 2, reps: '45s',
                notes: 'Heels flat if possible · hold something for balance',
                bodyweight: true,
              },
            ],
          },
        ],
      },
      B: {
        blocks: [
          {
            id: 'legs-b-strength',
            name: 'STRENGTH BLOCK',
            type: 'strength',
            exercises: [
              {
                name: 'DB Step-Up',
                sets: 4, reps: '6/side',
                notes: 'Heavy DBs · step onto bench · drive through heel',
              },
              {
                name: 'Single-Leg RDL',
                sets: 4, reps: '6/side',
                notes: 'DB in opposite hand · hinge slow · feel hamstring',
              },
            ],
          },
          {
            id: 'legs-b-hypertrophy',
            name: 'HYPERTROPHY BLOCK',
            type: 'hypertrophy',
            exercises: [
              {
                name: 'DB Sumo Squat',
                sets: 3, reps: '15',
                notes: 'Wide stance · toes out · DB hanging between legs',
              },
              {
                name: 'DB Glute Bridge',
                sets: 3, reps: '15',
                notes: 'Shoulders on bench · DB on hips · squeeze at top',
              },
              {
                name: 'Standing Calf Raise',
                sets: 4, reps: '20',
                notes: 'Both feet · edge of step · pause at top and bottom · add DBs for load',
              },
            ],
          },
          {
            id: 'legs-b-core',
            name: 'CORE + MOBILITY',
            type: 'mobility',
            exercises: [
              {
                name: 'Hollow Body Hold',
                sets: 3, reps: '20–30s',
                notes: 'Arms overhead · low back pressed down · legs low',
                bodyweight: true,
              },
              {
                name: 'Side Plank',
                sets: 3, reps: '30s/side',
                notes: 'Body straight · hip up · don\'t rotate',
                bodyweight: true,
              },
              {
                name: 'Hip Flexor Stretch',
                sets: 2, reps: '60s/side',
                notes: 'Lunge position · back knee down · tuck pelvis',
              },
              {
                name: 'Cossack Squat',
                sets: 2, reps: '8/side',
                notes: 'Wide stance · shift side to side · heel stays flat',
              },
            ],
          },
        ],
      },
    },
  },
]
