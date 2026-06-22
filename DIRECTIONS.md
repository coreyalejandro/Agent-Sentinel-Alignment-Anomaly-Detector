# HOW TO USE AGENT SENTINEL
# Plain-language setup and use guide
# Written for a user with ADHD, autism, and spatial reasoning challenges.
# Every step is numbered. No step depends on remembering a previous step.
# Each step tells you exactly where to look and exactly what to type or click.

==============================================================================
PART A — ONE-TIME SETUP (do this once, never again)
==============================================================================

STEP 1 — Open your Terminal
   - Press Command + Space on your keyboard.
   - The Spotlight search box appears in the middle of your screen.
   - Type the word:   Terminal
   - Press Enter.
   - A black or white window appears with a blinking cursor.
   - That is your Terminal. Leave it open.

STEP 2 — Go to the app folder
   - Click inside the Terminal window so it is active.
   - Type this exactly, then press Enter:
     cd /Users/coreyalejandro/Projects/agent-sentinel-alignment-anomaly-detector

   - The cursor moves to a new line. Nothing else happens. That is correct.

STEP 3 — Get a free OpenRouter API key
   - Open your web browser (Chrome, Safari, Firefox — any of them).
   - Go to this address:   https://openrouter.ai/keys
   - Sign up for a free account. No credit card is needed.
   - After signing in, click the button that says "Create Key".
   - A long string of letters and numbers appears.
     It looks like this:   sk-or-v1-abc123...
   - Copy that entire string. Keep this browser tab open.

STEP 4 — Create your key file
   - Go back to your Terminal window.
   - Type this exactly, then press Enter:
     cp .env.local.example .env.local

   - Nothing appears to happen. That is correct. The file was created.

STEP 5 — Open the key file
   - Type this exactly, then press Enter:
     open -e .env.local

   - A plain text file opens in TextEdit.
   - You will see a line that says:
       VITE_OPENROUTER_API_KEY=your-o...n

STEP 6 — Paste your key into the file
   - In the TextEdit window:
   - Delete the text that says:   your-o...n
   - Paste your key from Step 3 in its place.
   - The line should now look like this (with your actual key):
       VITE_OPENROUTER_API_KEY=sk-or-v1-abc123...
   - Press Command + S to save the file.
   - Close the TextEdit window.

STEP 7 — Start the app
   - Go back to your Terminal window.
   - Type this exactly, then press Enter:
     npm run dev

   - Wait. You will see several lines of text appear.
   - When you see a line that contains:
       Local:   http://localhost:3000
   - That means the app is ready.
   - Do not close the Terminal window. The app needs it to stay open.

STEP 8 — Open the app
   - Open your web browser.
   - Go to this address:   http://localhost:3000
   - The Agent Sentinel app appears.
   - Setup is complete. You do not need to do Steps 1-7 again.

==============================================================================
PART B — HOW TO USE THE APP (do this every time you want to analyze logs)
==============================================================================

The app has 3 steps. It shows you which step you are on at the top of the page.
You cannot skip a step. You cannot go to Step 2 before finishing Step 1.

----------------------------------------------------------------------
STEP 1 OF 3 — ADD YOUR LOGS
----------------------------------------------------------------------

You are on this step when you see the heading:
   "Add your AI logs"

You have two choices. Use one of them — you do not need both.

CHOICE A — Upload a file from your computer:
   - Find the large blue button.
   - The button says:   "Click here to choose log files from your computer"
   - Click that button.
   - A file picker window opens.
   - Navigate to your log file.
   - Click on the file to select it.
   - Click the button that says "Open" or "Choose".
   - The window closes. Below the button you will see:
       "(number) lines ready"
   - That means your file is loaded.

CHOICE B — Paste text:
   - Find the large dark text area below the "or paste text below" divider.
   - Click inside it.
   - Paste your log text (Command + V).
   - Below the text area you will see:
       "(number) lines ready"
   - That means your text is loaded.

When you have at least one line of logs loaded, the button at the bottom changes
from faded to bright blue. The button says:
   "Next — Describe what you noticed →"

- Click that button.
- You move to Step 2.

----------------------------------------------------------------------
STEP 2 OF 3 — DESCRIBE WHAT YOU NOTICED
----------------------------------------------------------------------

You are on this step when you see the heading:
   "Describe what you noticed"

This step is optional. You do not have to type anything here.

If something seemed wrong with your AI's behavior, type it here in plain words.
You do not need technical language. Examples are shown in the box as placeholder text.

When you are ready, find the large blue button at the bottom.
The button says:   "Run Analysis"

- Click that button.
- The button changes to show a spinning circle and the text:
    "Running analysis — this takes about 15–30 seconds…"
- Wait. Do not click anything. Do not refresh the page.
- When analysis is done, the page moves to Step 3 automatically.

If an error appears in a red box, read the message.
The most common error is a missing API key.
If you see "VITE_OPENROUTER_API_KEY is not set", go back to Setup Step 6.

----------------------------------------------------------------------
STEP 3 OF 3 — YOUR REPORT
----------------------------------------------------------------------

You are on this step when you see the heading:
   "Your report is ready"

The page shows:
   - A summary paragraph under the heading (read this first)
   - Six number boxes: alignment score, policy compliance, issues found,
     critical risks, lines checked, data source
   - A chart showing risk over time (higher score = more risk)
   - A list of findings

READING A FINDING:
   - Each finding is a row with a colored label on the left.
   - The label colors mean:
       BLUE = LOW severity (minor concern)
       AMBER = MEDIUM severity (worth investigating)
       ORANGE = HIGH severity (take action soon)
       RED + PULSING = CRITICAL (act immediately)
   - Click anywhere on a row to expand it.
   - When expanded, you see:
       "What the AI found" — the specific evidence from your logs
       "What to do about it" — the recommended action in plain language

DOWNLOADING YOUR REPORT:
   - Find the button that says "Download Full Report (JSON)".
   - Click it.
   - A file named AGENT_SENTINEL_REPORT_[date].json saves to your Downloads folder.
   - This is your audit record. Keep it.

ANALYZING ANOTHER SET OF LOGS:
   - Find the button that says "Analyze Another Set of Logs".
   - Click it.
   - The app returns to Step 1. Everything is cleared. Start fresh.

==============================================================================
PART C — STOPPING AND STARTING THE APP
==============================================================================

TO STOP THE APP:
   - Go to your Terminal window.
   - Press Control + C.
   - The app stops. The browser page will no longer load.

TO START THE APP AGAIN:
   1. Open Terminal (Command + Space, type Terminal, press Enter)
   2. Type:   cd /Users/coreyalejandro/Projects/agent-sentinel-alignment-anomaly-detector
      Press Enter.
   3. Type:   npm run dev
      Press Enter.
   4. Wait for the line:   Local:   http://localhost:3000
   5. Open your browser and go to:   http://localhost:3000

==============================================================================
PART D — IF SOMETHING GOES WRONG
==============================================================================

PROBLEM: The page shows a red error box saying "VITE_OPENROUTER_API_KEY is not set"
FIX:
   1. Go to Terminal. Press Control + C to stop the app.
   2. Type:   open -e .env.local   and press Enter.
   3. Check that line 1 says:   VITE_OPENROUTER_API_KEY=sk-or-v1-...
      (your actual key, not placeholder text)
   4. Save the file (Command + S).
   5. Type:   npm run dev   and press Enter.

PROBLEM: The page says "OpenRouter returned 401"
FIX: Your API key is wrong or expired. Go to https://openrouter.ai/keys,
     create a new key, and repeat Setup Steps 5-6.

PROBLEM: The analysis runs but returns no findings when you expect some
FIX: The free model may have missed something. Open services/analysisService.ts
     and change MODEL_ID to a different free model from this list:
       "mistralai/mistral-7b-instruct:free"
       "google/gemma-3-27b-it:free"

PROBLEM: The page is blank or shows a white screen
FIX: Press Command + R to reload the page. If still blank, stop the app
     (Control + C in Terminal) and run npm run dev again.

==============================================================================
END OF DIRECTIONS
File location: /Users/coreyalejandro/Projects/agent-sentinel-alignment-anomaly-detector/DIRECTIONS.md
==============================================================================
