import os
import time
import json
from datetime import datetime

WATCH_PATH = 'D:/1new folder/devlopment'
ERROR_FILES = ['js-errors.jsonl', 'py-errors.jsonl']
FIXES_FILE = os.path.join(os.path.dirname(__file__), '../collected-data/fixes.jsonl')
DATA_DIR = os.path.join(os.path.dirname(__file__), '../collected-data')
FILE_CACHE = {}
RECENT_ERRORS = []

def load_errors():
    global RECENT_ERRORS
    RECENT_ERRORS.clear()
    for f in ERROR_FILES:
        path = os.path.join(DATA_DIR, f)
        if os.path.exists(path):
            with open(path, 'r') as file:
                RECENT_ERRORS += [json.loads(line) for line in file.readlines()][-50:]

def get_diff(old, new):
    return [f"- {o}" for o in old if o not in new] + [f"+ {n}" for n in new if n not in old]

def track_changes():
    load_errors()
    print(f"🟡 Loaded {len(RECENT_ERRORS)} recent errors")

    while True:
        for root, _, files in os.walk(WATCH_PATH):
            if 'node_modules' in root: continue
            for fname in files:
                if not fname.endswith(('.js', '.py')): continue
                fpath = os.path.join(root, fname)
                try:
                    with open(fpath, 'r') as f:
                        lines = f.readlines()
                except: continue

                prev = FILE_CACHE.get(fpath, [])
                if lines != prev:
                    diff = get_diff(prev, lines)
                    for error in RECENT_ERRORS:
                        if error['metadata']['filename'] == fpath:
                            if any(e.strip() in d for d in diff for e in error['error'].split('\n')):
                                fix = {
                                    'timestamp': datetime.utcnow().isoformat(),
                                    'file': fpath,
                                    'fix_description': 'Auto-detected fix via line diff',
                                    'related_error': error['timestamp'],
                                    'error_message': error['error'].split('\n')[0]
                                }
                                with open(FIXES_FILE, 'a') as f:
                                    f.write(json.dumps(fix) + '\n')
                                print(f"✅ Fix logged for {fpath}")
                FILE_CACHE[fpath] = lines
        time.sleep(5)

if __name__ == '__main__':
    print(f'🟢 Fix tracker watching: {WATCH_PATH}')
    track_changes()
