CREATE TABLE workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_name text NOT NULL,
  day_number int NOT NULL,
  day_label text NOT NULL,
  set_number int NOT NULL,
  reps text NOT NULL,
  weight_lbs numeric,
  logged_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_all" ON workout_logs FOR ALL USING (true) WITH CHECK (true);
