@echo off
echo Starting JS Error Logger...
node "D:/1new folder/devlopment/data-collector/watchers/watch-js-errors.js"
echo JS Error Logger started.
timeout /t 4

echo Starting Python Error Logger...
python "D:/1new folder/devlopment/data-collector/watchers/watch-py-errors.py"
echo Python Error Logger started.
timeout /t 4

echo Starting Fix Tracker (JS)...
node "D:/1new folder/devlopment/data-collector/fix-trackers/track-js-fix.js"
echo JS Fix Tracker started.
timeout /t 4

echo Starting Fix Tracker (Python)...
python "D:/1new folder/devlopment/data-collector/fix-trackers/track-py-fix.py"
echo Python Fix Tracker started.
timeout /t 4

echo Starting Dataset Formatter...
python "D:/1new folder/devlopment/data-collector/formatter/format-dataset.py"
echo Dataset Formatting completed.
