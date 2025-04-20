# import os
# import json
# from datetime import datetime

# data_dir = os.path.join(os.path.dirname(__file__), '../collected-data')
# output_file = os.path.join(data_dir, 'training-data.jsonl')

# errors = []
# for f in ['js-errors.jsonl', 'py-errors.jsonl']:
#     path = os.path.join(data_dir, f)
#     if os.path.exists(path):
#         with open(path, 'r') as file:
#             errors.extend(json.loads(line) for line in file)

# fixes = []
# fix_path = os.path.join(data_dir, 'fixes.jsonl')
# if os.path.exists(fix_path):
#     with open(fix_path, 'r') as file:
#         fixes.extend(json.loads(line) for line in file)

# training_data = []
# for err in errors:
#     related = [f for f in fixes if f['related_error'] == err['timestamp']]
#     training_data.append({
#         "error": err["error"],
#         "type": err["type"],
#         "source": err["source"],
#         "fixes": [f["fix_description"] for f in related],
#         "metadata": {
#             "timestamp": err["timestamp"],
#             "language": "javascript" if err["source"].endswith(".js") else "python"
#         }
#     })

# with open(output_file, 'w') as f:
#     for entry in training_data:
#         f.write(json.dumps(entry) + '\n')

# print(f"✅ Dataset formatted with {len(training_data)} entries.")


#!/usr/bin/env python3
import os
import json
import hashlib
from datetime import datetime
from collections import defaultdict
import argparse

class DatasetFormatter:
    def __init__(self, data_dir=None, output_file=None):
        self.data_dir = data_dir or os.path.join(os.path.dirname(__file__), '../collected-data')
        self.output_file = output_file or os.path.join(self.data_dir, 'training-data.jsonl')
        self.error_files = ['js-errors.jsonl', 'py-errors.jsonl']
        self.fix_file = 'fixes.jsonl'
        self.stats = {
            'total_errors': 0,
            'errors_with_fixes': 0,
            'skipped_entries': 0
        }

    def _generate_error_id(self, error):
        """Create consistent ID for error matching using multiple fields"""
        id_str = f"{error.get('error','')}-{error.get('file','')}-{error.get('line','')}"
        return hashlib.sha256(id_str.encode()).hexdigest()

    def _load_and_validate_jsonl(self, file_path):
        """Load JSONL file with validation and error handling"""
        if not os.path.exists(file_path):
            print(f"⚠️ File not found: {file_path}")
            return []

        data = []
        with open(file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f, 1):
                try:
                    item = json.loads(line)
                    if not isinstance(item, dict):
                        raise ValueError(f"Line {i}: Expected JSON object, got {type(item)}")
                    data.append(item)
                except json.JSONDecodeError as e:
                    print(f"⚠️ Invalid JSON in {file_path}, line {i}: {str(e)}")
                    continue
        return data

    def _determine_language(self, error):
        """Detect language from file extension or error source"""
        filename = error.get('file', '') or error.get('metadata', {}).get('filename', '')
        if filename.endswith(('.js', '.jsx')):
            return 'javascript'
        elif filename.endswith(('.py', '.pyw')):
            return 'python'
        return error.get('language', 'unknown')

    def _enrich_error_data(self, error):
        """Add additional metadata and structure to error data"""
        error_id = error.get('timestamp') or self._generate_error_id(error)
        language = self._determine_language(error)
        
        return {
            'error_id': error_id,
            'language': language,
            'raw_error': error,
            'timestamp': error.get('timestamp', datetime.now().isoformat())
        }

    def _create_training_example(self, error, fixes):
        """Format a single training example with error and fixes"""
        language = error['language']
        error_message = error['raw_error'].get('error', 'Unknown error')
        error_context = error['raw_error'].get('context', '')
        
        prompt = (
            f"Fix this {language} error:\n"
            f"Error: {error_message}\n"
            f"File: {error['raw_error'].get('file', 'unknown')}\n"
            f"Line: {error['raw_error'].get('line', '?')}\n"
            f"Context:\n{error_context}"
        )
        
        # Use the most recent fix as completion
        completion = fixes[-1]['fix_description'] if fixes else "No fix available"
        
        return {
            'prompt': prompt,
            'completion': completion,
            'metadata': {
                'error_id': error['error_id'],
                'language': language,
                'timestamp': error['timestamp'],
                'fix_count': len(fixes),
                'source_file': error['raw_error'].get('file', 'unknown')
            },
            'all_fixes': fixes
        }

    def process_data(self):
        """Main processing pipeline"""
        print("🔍 Loading and processing data files...")
        
        # Load all error data
        errors = []
        for f in self.error_files:
            file_path = os.path.join(self.data_dir, f)
            errors.extend(self._enrich_error_data(e) for e in self._load_and_validate_jsonl(file_path))
        self.stats['total_errors'] = len(errors)

        # Load fixes and index by error ID
        fixes = self._load_and_validate_jsonl(os.path.join(self.data_dir, self.fix_file))
        fix_map = defaultdict(list)
        for fix in fixes:
            error_id = fix.get('errorSignature') or fix.get('related_error')
            if error_id:
                fix_map[error_id].append(fix)

        # Generate training examples
        training_data = []
        for error in errors:
            error_id = error['error_id']
            related_fixes = fix_map.get(error_id, [])
            
            if not related_fixes:
                self.stats['skipped_entries'] += 1
                continue
                
            self.stats['errors_with_fixes'] += 1
            training_data.append(self._create_training_example(error, related_fixes))

        return training_data

    def save_dataset(self, data):
        """Save dataset with atomic write operation"""
        print("💾 Saving training dataset...")
        
        # Create temp file first
        temp_file = f"{self.output_file}.tmp"
        with open(temp_file, 'w', encoding='utf-8') as f:
            for item in data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        # Atomic replacement
        if os.path.exists(self.output_file):
            os.replace(temp_file, self.output_file)
        else:
            os.rename(temp_file, self.output_file)

    def print_stats(self):
        """Print processing statistics"""
        print("\n📊 Processing Statistics:")
        print(f"Total errors processed: {self.stats['total_errors']}")
        print(f"Errors with fixes: {self.stats['errors_with_fixes']}")
        print(f"Skipped entries (no fixes): {self.stats['skipped_entries']}")
        coverage = (self.stats['errors_with_fixes'] / self.stats['total_errors']) * 100 if self.stats['total_errors'] > 0 else 0
        print(f"Coverage: {coverage:.2f}%")

    def run(self):
        """Execute the full pipeline"""
        start_time = datetime.now()
        
        data = self.process_data()
        self.save_dataset(data)
        
        self.print_stats()
        print(f"\n⏱️  Processing time: {datetime.now() - start_time}")

def main():
    parser = argparse.ArgumentParser(description='Format error tracking data into training dataset')
    parser.add_argument('--data-dir', help='Directory containing collected data files')
    parser.add_argument('--output', help='Output file path for training data')
    args = parser.parse_args()

    formatter = DatasetFormatter(
        data_dir=args.data_dir,
        output_file=args.output
    )
    formatter.run()

if __name__ == "__main__":
    main()