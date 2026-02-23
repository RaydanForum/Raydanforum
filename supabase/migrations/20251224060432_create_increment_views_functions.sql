/*
  # Create RPC functions for incrementing view counts

  1. Functions
    - `increment_briefing_views` - Increments the views_count for a briefing
    - `increment_activity_views` - Increments a view counter for activities (if needed in future)

  2. Security
    - Functions are publicly accessible (no authentication required)
    - Functions use atomic operations to prevent race conditions
*/

CREATE OR REPLACE FUNCTION increment_briefing_views(briefing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE briefings
  SET views_count = views_count + 1
  WHERE id = briefing_id;
END;
$$;
