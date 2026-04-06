export const GRIP_DAY = { day: null, label: 'GRIP' }

export const GRIP_BLOCKS = [
  {
    id: 'grip-hang',
    name: 'HANG STRENGTH',
    type: 'strength',
    exercises: [
      {
        name: 'Dead Hang',
        sets: 3, reps: '30–45s',
        notes: 'Full passive hang · breathe · let shoulders open',
        bodyweight: true,
      },
      {
        name: 'Active Hang',
        sets: 3, reps: '20s',
        notes: 'Engage lats · depress shoulders · maintain tension throughout',
        bodyweight: true,
      },
      {
        name: 'Towel Hang',
        sets: 3, reps: '20s',
        notes: 'Loop towel over bar · grip each end · full hang · no kipping',
        bodyweight: true,
      },
    ],
  },
  {
    id: 'grip-loaded',
    name: 'LOADED GRIP',
    type: 'hypertrophy',
    exercises: [
      {
        name: 'DB Farmer Carry',
        sets: 3, reps: '40s',
        notes: 'Heavy DBs · walk or hold still · squeeze hard · no straps',
      },
      {
        name: 'Plate Pinch Hold',
        sets: 3, reps: '30s',
        notes: 'Pinch two plates together · thumb on one side · hold at sides',
      },
      {
        name: 'DB Timed Hold',
        sets: 3, reps: '45s',
        notes: 'Heavy DBs · stand still · hold until grip fails · rest 90s',
      },
    ],
  },
  {
    id: 'grip-wrist',
    name: 'WRIST & FOREARM',
    type: 'mobility',
    exercises: [
      {
        name: 'DB Wrist Curl',
        sets: 3, reps: '15',
        notes: 'Forearm on thigh · palm up · full ROM · slow eccentric',
      },
      {
        name: 'DB Reverse Curl',
        sets: 3, reps: '12',
        notes: 'Overhand grip · curl to shoulder · elbows fixed · control down',
      },
      {
        name: 'Wrist Flexor Stretch',
        sets: 2, reps: '30s/side',
        notes: 'Arm extended · pull fingers back gently · hold',
        bodyweight: true,
      },
    ],
  },
]
