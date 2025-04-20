import os
import subprocess
import json
from datetime import datetime

PROJECT_DIR = 'D:/1new folder/devlopment/python'  # Update path if needed
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '../collected-data/py-errors.jsonl')

def log_error(error_output, file_path):
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "error": error_output.strip(),
        "type": "RuntimeError",
        "source": file_path,
        "metadata": {"filename": file_path}
    }
    with open(OUTPUT_FILE, 'a') as f:
        f.write(json.dumps(entry) + '\n')
    print(f"❌ Python Error logged from {file_path}")

def scan_files():
    for fname in os.listdir(PROJECT_DIR):
        if fname.endswith(".py"):
            full_path = os.path.join(PROJECT_DIR, fname)
            result = subprocess.run(['python', full_path], capture_output=True, text=True)
            if result.stderr:
                log_error(result.stderr, full_path)

scan_files()
