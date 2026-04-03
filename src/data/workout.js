// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT DATA — 3-day push/pull/legs split
// To fill in YouTube IDs: search the exercise name on YouTube, copy the 11-char
// ID from the URL (youtube.com/watch?v=XXXXXXXXXXX) and paste it below.
// ─────────────────────────────────────────────────────────────────────────────

export const WORKOUT = [
  {
    day: 1,
    label: 'PUSH',
    subtitle: 'Chest · Shoulders · Triceps',
    blocks: [
      {
        id: 'push-strength',
        name: 'STRENGTH BLOCK',
        type: 'strength',
        exercises: [
          {
            name: 'Dumbbell Floor Press',
            sets: 4, reps: '5',
            notes: 'Heavy 40–50 lb · focus on chest squeeze at top',
            youtubeId: '',
            searchHint: 'dumbbell floor press form tutorial',
          },
          {
            name: 'Pike Push-Up',
            sets: 3, reps: '6',
            notes: '3 sec eccentric · hips high · elbows track back',
            youtubeId: '',
            searchHint: 'pike push up slow eccentric tutorial',
          },
        ],
      },
      {
        id: 'push-hypertrophy',
        name: 'HYPERTROPHY BLOCK',
        type: 'hypertrophy',
        exercises: [
          {
            name: 'Incline DB Press',
            sets: 3, reps: '10–12',
            notes: 'Bench at 30–45° · elbows 45° to torso',
            youtubeId: '',
            searchHint: 'incline dumbbell press form tutorial',
          },
          {
            name: 'Lateral Raise',
            sets: 3, reps: '15',
            notes: 'Slight forward lean · lead with elbows · no shrug',
            youtubeId: '',
            searchHint: 'dumbbell lateral raise form tutorial',
          },
          {
            name: 'Dips',
            sets: 3, reps: '12–15',
            notes: 'Slight forward lean for chest bias · full lockout',
            youtubeId: '',
            searchHint: 'dips form tutorial triceps chest',
          },
          {
            name: 'DB Overhead Press',
            sets: 3, reps: '10',
            notes: 'Standing · brace core · neutral wrists · full ROM',
            youtubeId: '',
            searchHint: 'dumbbell overhead press standing form tutorial',
          },
        ],
      },
      {
        id: 'push-mobility',
        name: 'MOBILITY FINISHER',
        type: 'mobility',
        duration: '8 MIN',
        exercises: [
          {
            name: 'Shoulder CARs',
            sets: 2, reps: '5/side',
            notes: 'Slow, full-range rotations · brace everything else',
            youtubeId: '',
            searchHint: 'shoulder CARs controlled articular rotations',
          },
          {
            name: 'Wall Slide',
            sets: 3, reps: '10',
            notes: 'Back flat against wall · arms slide overhead',
            youtubeId: '',
            searchHint: 'wall slide shoulder mobility exercise',
          },
          {
            name: 'Doorway Pec Stretch',
            sets: 2, reps: '45s',
            notes: 'Elbow at 90° · step through slowly · no pain',
            youtubeId: '',
            searchHint: 'doorway pec chest stretch how to',
          },
        ],
      },
    ],
  },

  {
    day: 2,
    label: 'PULL',
    subtitle: 'Back · Biceps · Rear Delts',
    blocks: [
      {
        id: 'pull-strength',
        name: 'STRENGTH BLOCK',
        type: 'strength',
        exercises: [
          {
            name: 'Weighted Pull-Up',
            sets: 4, reps: '5',
            notes: 'DB between feet or loaded pack · dead-hang start',
            youtubeId: '',
            searchHint: 'weighted pull up form tutorial',
          },
          {
            name: 'Chest-to-Bar Pull-Up',
            sets: 3, reps: 'max',
            notes: 'Pull until sternum touches bar · controlled descent',
            youtubeId: '',
            searchHint: 'chest to bar pull up tutorial calisthenics',
          },
        ],
      },
      {
        id: 'pull-hypertrophy',
        name: 'HYPERTROPHY BLOCK',
        type: 'hypertrophy',
        exercises: [
          {
            name: 'Single-Arm DB Row',
            sets: 3, reps: '12/side',
            notes: 'Brace on bench · elbow past torso · squeeze at top',
            youtubeId: '',
            searchHint: 'single arm dumbbell row form tutorial',
          },
          {
            name: 'DB High Pull',
            sets: 3, reps: '15',
            notes: 'Face pull substitute · elbows high and wide · control',
            youtubeId: '',
            searchHint: 'dumbbell high pull face pull substitute tutorial',
          },
          {
            name: 'Hammer Curl',
            sets: 3, reps: '12',
            notes: 'Neutral grip · no swing · full extension at bottom',
            youtubeId: '',
            searchHint: 'hammer curl form tutorial dumbbell',
          },
          {
            name: 'DB Curl',
            sets: 3, reps: '10',
            notes: 'Supinate at top · slow eccentric · don\'t swing',
            youtubeId: '',
            searchHint: 'dumbbell bicep curl supination form tutorial',
          },
        ],
      },
      {
        id: 'pull-mobility',
        name: 'MOBILITY FINISHER',
        type: 'mobility',
        duration: '8 MIN',
        exercises: [
          {
            name: 'Thoracic Extension over Bench',
            sets: 2, reps: '60s',
            notes: 'Mid-back on bench edge · arms behind head · relax',
            youtubeId: '',
            searchHint: 'thoracic extension over bench mobility',
          },
          {
            name: 'Thread the Needle',
            sets: 2, reps: '8/side',
            notes: 'On all-fours · reach under and rotate fully',
            youtubeId: '',
            searchHint: 'thread the needle thoracic rotation exercise',
          },
          {
            name: 'Dead Hang',
            sets: 3, reps: '30–45s',
            notes: 'Full passive hang · breathe · let shoulders open',
            youtubeId: '',
            searchHint: 'dead hang shoulder decompression how to',
          },
        ],
      },
    ],
  },

  {
    day: 3,
    label: 'LEGS',
    subtitle: 'Legs · Core',
    blocks: [
      {
        id: 'legs-strength',
        name: 'STRENGTH BLOCK',
        type: 'strength',
        exercises: [
          {
            name: 'Bulgarian Split Squat',
            sets: 4, reps: '6/side',
            notes: 'Heavy DBs · rear foot elevated · torso upright',
            youtubeId: '',
            searchHint: 'bulgarian split squat dumbbell form tutorial',
          },
          {
            name: 'Romanian Deadlift',
            sets: 4, reps: '8',
            notes: '45–50 lb DBs · hinge at hips · feel hamstring stretch',
            youtubeId: '',
            searchHint: 'dumbbell romanian deadlift RDL form tutorial',
          },
        ],
      },
      {
        id: 'legs-hypertrophy',
        name: 'HYPERTROPHY BLOCK',
        type: 'hypertrophy',
        exercises: [
          {
            name: 'DB Goblet Squat',
            sets: 3, reps: '15',
            notes: 'DB at chest · elbows track knees · full depth',
            youtubeId: '',
            searchHint: 'dumbbell goblet squat form tutorial',
          },
          {
            name: 'Hip Thrust on Bench',
            sets: 3, reps: '15',
            notes: 'DB on hips · upper back on bench · full hip extension',
            youtubeId: '',
            searchHint: 'dumbbell hip thrust bench form tutorial',
          },
          {
            name: 'Nordic Hamstring Curl',
            sets: 3, reps: '5–8',
            notes: 'Feet anchored under bar/bench · slow fall · eccentric focus',
            youtubeId: '',
            searchHint: 'nordic hamstring curl how to tutorial',
          },
        ],
      },
      {
        id: 'legs-core',
        name: 'CORE + MOBILITY',
        type: 'mobility',
        duration: '10 MIN',
        exercises: [
          {
            name: 'Dead Bug',
            sets: 3, reps: '8/side',
            notes: 'Low back glued to floor · slow · full extension',
            youtubeId: '',
            searchHint: 'dead bug core exercise tutorial',
          },
          {
            name: 'Copenhagen Plank',
            sets: 3, reps: '20–30s/side',
            notes: 'Foot on bench · hip stays level · don\'t sag',
            youtubeId: '',
            searchHint: 'copenhagen plank tutorial how to',
          },
          {
            name: '90/90 Hip Stretch',
            sets: 2, reps: '60s/side',
            notes: 'Both knees at 90° · sit tall · feel outer hip',
            youtubeId: '',
            searchHint: '90 90 hip stretch tutorial mobility',
          },
          {
            name: 'Deep Squat Hold',
            sets: 2, reps: '45s',
            notes: 'Heels flat if possible · hold something for balance',
            youtubeId: '',
            searchHint: 'deep squat hold mobility tutorial',
          },
        ],
      },
    ],
  },
]
