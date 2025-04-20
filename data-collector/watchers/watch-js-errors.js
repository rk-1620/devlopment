// // watch-js-errors.js

// const fs = require('fs');
// const path = require('path');
// const chokidar = require('chokidar');
// const os = require('os');

// // Path setup
// const projectPath = 'D:/1new folder/devlopment'; // Update this as needed
// const ERRORS_PATH = path.join(__dirname, '../collected-data/js-errors.jsonl');
// const FIXES_LOG_PATH = path.join(__dirname, '../collected-data/fixes.jsonl');
// // console.log(ERRORS_PATH);


// // Cache for file versions and errors
// const fileVersions = {};
// let knownErrors = [];
// let processedErrors = new Set(); // Keep track of processed errors

// // Load recent errors from the error log
// function loadErrors() {
//     console.log('Loaded errors:', knownErrors); // To see if errors are loaded

//     if (!fs.existsSync(ERRORS_PATH)) return;

//     const lines = fs.readFileSync(ERRORS_PATH, 'utf-8').trim().split('\n');
//     knownErrors = lines.slice(-100).map(line => {
//         try {
//             return JSON.parse(line);
//         } catch (e) {
//             return null;
//         }
//     }).filter(Boolean);

//     // Store the timestamps of processed errors
//     knownErrors.forEach(error => {
//         if (error.timestamp) {
//             processedErrors.add(error.timestamp);
//         }
//     });
// }

// // Compare two versions of file content (before and after change)
// function getDiff(oldLines, newLines) {
//     const diff = [];
//     const maxLen = Math.max(oldLines.length, newLines.length);
//     for (let i = 0; i < maxLen; i++) {
//         const oldLine = oldLines[i] || '';
//         const newLine = newLines[i] || '';
//         if (oldLine !== newLine) {
//             diff.push(`- ${oldLine}`);
//             diff.push(`+ ${newLine}`);
//         }
//     }
//     return diff;
// }

// // Check if the error is related to the specific file
// function isErrorRelatedToFile(error, filePath) {
//     if (error.metadata && error.metadata.filename) {
//         const errorPath = path.resolve(error.metadata.filename);
//         return errorPath === path.resolve(filePath);
//     }
//     return false;
// }

// // Log fix if the diff suggests it fixes an error
// function logFix(filePath, error, description) {
//     console.log('Fix logged:', fixData); // To ensure fixes are being logged

//     const fixData = {
//         timestamp: new Date().toISOString(),
//         file: filePath,
//         fix_description: description,
//         related_error: error.timestamp,
//         error_message: error.error.split('\n')[0],
//     };

//     fs.appendFileSync(FIXES_LOG_PATH, JSON.stringify(fixData) + os.EOL);
//     console.log(`✅ Logged fix for error at ${error.timestamp}`);
// }

// // Analyze file for changes and check if it fixes an error
// function analyzeChange(filePath) {
//     console.log('File change detected:', filePath);

//     const currentContent = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
//     const previousContent = fileVersions[filePath] || [];

//     const diff = getDiff(previousContent, currentContent);

//     if (diff.length > 0) {
//         for (const error of knownErrors) {
//             if (isErrorRelatedToFile(error, filePath) && !processedErrors.has(error.timestamp)) {
//                 if (diff.some(line => line.includes(error.error.split('\n')[0]))) {
//                     logFix(filePath, error, 'Potential fix based on error content diff');
//                     processedErrors.add(error.timestamp);  // Mark this error as processed
//                 }
//             }
//         }
//     }

//     // Update cache with the current content for future diffing
//     fileVersions[filePath] = currentContent;
// }

// // Start tracking JS file changes
// function startTracking() {
//     console.log('Watching files at:', projectPath); // To confirm that the path is correct

//     loadErrors();

//     // Watch specific directories and file types while excluding unwanted directories like node_modules, build, etc.
//     const watcher = chokidar.watch(path.join(projectPath, '**/*.{js,jsx,ts,tsx}'), {
//         ignored: [
//             /node_modules/,          // Ignore node_modules
//             /build/,                 // Ignore build directories
//             // /.*\.test\.js$/,         // Ignore test files
//             /.*\.spec\.js$/,         // Ignore spec files
//             /.*\.log$/,              // Ignore log files
//         ],
//         persistent: true,
//     });

//     watcher.on('change', (filePath) => {
//         try {
//             analyzeChange(filePath);
//         } catch (e) {
//             console.error(`❌ Error analyzing ${filePath}: ${e.message}`);
//         }
//     });

//     console.log('🟢 JS Fix tracker started. Watching for file changes...');
// }

// if (require.main === module) {
//     startTracking();
// }


// /data-collector/watchers/watch-js-errors.js
const fs = require('fs/promises');
const path = require('path');
const chokidar = require('chokidar');
const { EOL } = require('os');
const { performance } = require('perf_hooks');
const { createHash } = require('crypto');

// Configuration
const CONFIG = {
    PROJECT_ROOT: path.resolve('D:/1new folder/devlopment'),
    ERROR_LOG_PATH: path.join(__dirname, '../collected-data/js-errors.jsonl'),
    FIX_LOG_PATH: path.join(__dirname, '../collected-data/fixes.jsonl'),
    WATCH_EXTENSIONS: ['js', 'jsx', 'ts', 'tsx'],
    IGNORED_PATTERNS: [
        '**/node_modules/**',
        '**/build/**',
        '**/dist/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.mock.*'
    ],
    MAX_ERROR_CACHE: 1000,
    DEBOUNCE_DELAY: 500, // ms
    ERROR_CONTEXT_LINES: 3 // Lines around error for context
};

// State management
const state = {
    fileVersions: new Map(),
    errorCache: new Map(),
    pendingChanges: new Map(),
    processingLock: false
};

// Utility functions
const generateErrorId = (error) => {
    const hash = createHash('sha256');
    hash.update(`${error.message}|${error.file}|${error.line}`);
    return hash.digest('hex');
};

const getErrorContext = (content, lineNumber) => {
    const lines = content.split('\n');
    const start = Math.max(0, lineNumber - CONFIG.ERROR_CONTEXT_LINES);
    const end = Math.min(lines.length, lineNumber + CONFIG.ERROR_CONTEXT_LINES + 1);
    return {
        before: lines.slice(start, lineNumber),
        after: lines.slice(lineNumber + 1, end),
        errorLine: lines[lineNumber] || ''
    };
};

// Error processing
async function logError(errorData) {
    try {
        await fs.appendFile(CONFIG.ERROR_LOG_PATH, JSON.stringify(errorData) + EOL);
        
        // Update cache
        const errorId = generateErrorId(errorData);
        state.errorCache.set(errorId, {
            ...errorData,
            errorId,
            timestamp: errorData.timestamp || new Date().toISOString()
        });
        
        console.log(`📛 Logged error: ${errorData.message.substring(0, 100)}...`);
        return errorId;
    } catch (error) {
        console.error('❌ Failed to log error:', error.message);
        return null;
    }
}

async function logFix(errorId, fixData) {
    try {
        const fullFixData = {
            ...fixData,
            errorId,
            timestamp: new Date().toISOString(),
            detected_at: performance.now()
        };
        
        await fs.appendFile(CONFIG.FIX_LOG_PATH, JSON.stringify(fullFixData) + EOL);
        console.log(`✅ Logged fix for error ${errorId}`);
    } catch (error) {
        console.error('❌ Failed to log fix:', error.message);
    }
}

// File analysis
async function analyzeFile(filePath) {
    const now = performance.now();
    
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const previousContent = state.fileVersions.get(filePath) || '';
        
        if (content === previousContent) {
            return; // No changes
        }
        
        // Store current version
        state.fileVersions.set(filePath, content);
        
        // Skip if we're already processing this file
        if (state.processingLock) return;
        state.processingLock = true;
        
        // Analyze for both errors and fixes
        await detectNewErrors(filePath, content);
        await detectFixes(filePath, previousContent, content);
        
    } catch (error) {
        console.error(`❌ Error analyzing ${filePath}:`, error.message);
    } finally {
        state.processingLock = false;
        console.debug(`⏱️  Processed ${filePath} in ${(performance.now() - now).toFixed(2)}ms`);
    }
}

async function detectNewErrors(filePath, content) {
    // This would integrate with your actual error detection logic
    // For now, we'll simulate finding errors in changed lines
    
    const lines = content.split('\n');
    const previousLines = (state.fileVersions.get(filePath) || '').split('\n');
    
    // Simple diff to find changed lines
    for (let i = 0; i < lines.length; i++) {
        if (i >= previousLines.length || lines[i] !== previousLines[i]) {
            // Simulate finding an error in changed line
            if (lines[i].includes('error') || lines[i].includes('throw')) {
                const errorData = {
                    timestamp: new Date().toISOString(),
                    message: `Potential error at line ${i + 1}`,
                    file: filePath,
                    line: i + 1,
                    code: lines[i],
                    context: getErrorContext(content, i),
                    metadata: {
                        filename: filePath,
                        project: path.relative(CONFIG.PROJECT_ROOT, filePath).split(path.sep)[0]
                    }
                };
                
                await logError(errorData);
            }
        }
    }
}

async function detectFixes(filePath, oldContent, newContent) {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    // Check if any previously logged errors were fixed
    for (const [errorId, error] of state.errorCache) {
        if (error.file !== filePath) continue;
        
        const errorLine = error.line - 1; // Convert to 0-based index
        if (errorLine >= oldLines.length) continue;
        
        // Check if the error line was modified
        if (oldLines[errorLine] !== newLines[errorLine]) {
            const fixData = {
                file: filePath,
                fix_description: `Changed "${oldLines[errorLine]}" to "${newLines[errorLine]}"`,
                context: {
                    before: getErrorContext(oldContent, errorLine),
                    after: getErrorContext(newContent, errorLine)
                }
            };
            
            await logFix(errorId, fixData);
            state.errorCache.delete(errorId); // Remove fixed error from cache
        }
    }
}

// File watching
function setupWatcher() {
    const watcher = chokidar.watch(
        path.join(CONFIG.PROJECT_ROOT, '**', `*.{${CONFIG.WATCH_EXTENSIONS.join(',')}}`),
        {
            ignored: CONFIG.IGNORED_PATTERNS,
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: CONFIG.DEBOUNCE_DELAY,
                pollInterval: 100
            }
        }
    );
    
    watcher
        .on('add', filePath => analyzeFile(filePath))
        .on('change', filePath => analyzeFile(filePath))
        .on('unlink', filePath => state.fileVersions.delete(filePath))
        .on('error', error => console.error('Watcher error:', error));
    
    return watcher;
}

// Initialization
async function initialize() {
    console.log('🚀 Starting JavaScript Error Watcher');
    console.log(`📂 Monitoring: ${CONFIG.PROJECT_ROOT}`);
    console.log(`👁️  Watching extensions: ${CONFIG.WATCH_EXTENSIONS.join(', ')}`);
    
    try {
        // Load recent errors
        if (fs.existsSync(CONFIG.ERROR_LOG_PATH)) {
            const data = await fs.readFile(CONFIG.ERROR_LOG_PATH, 'utf-8');
            data.trim().split('\n').slice(-CONFIG.MAX_ERROR_CACHE).forEach(line => {
                try {
                    const error = JSON.parse(line);
                    state.errorCache.set(generateErrorId(error), error);
                } catch (e) {
                    console.warn('Skipping invalid error log entry');
                }
            });
        }
        
        console.log(`📊 Loaded ${state.errorCache.size} recent errors from log`);
        
        // Start watching files
        const watcher = setupWatcher();
        
        // Cleanup on exit
        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down watcher...');
            await watcher.close();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
}

// Start the watcher
if (require.main === module) {
    initialize();
}
