// // /data-collector/fix-trackers/track-js-fix.js

// const fs = require('fs');
// const path = require('path');
// const os = require('os');

// // Paths
// const FIXES_LOG_PATH = path.join(__dirname, '../collected-data/fixes.jsonl');
// const JS_ERRORS_PATH = path.join(__dirname, '../collected-data/js-errors.jsonl');

// // Cache for file versions and known errors
// let knownErrors = [];
// let fileVersions = {};

// // Load the known errors from js-errors.jsonl
// function loadErrors() {
//     if (!fs.existsSync(JS_ERRORS_PATH)) return;
    
//     const lines = fs.readFileSync(JS_ERRORS_PATH, 'utf-8').trim().split('\n');
//     knownErrors = lines.map(line => {
//         try {
//             return JSON.parse(line);
//         } catch (e) {
//             return null;
//         }
//     }).filter(Boolean);
// }

// // Compare old and new file contents to detect differences
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

// // Check if a fix is related to any previous errors in the file
// function isFixRelatedToError(fix, error) {
//     const fixPath = path.resolve(fix.file);
//     const errorPath = path.resolve(error.metadata.filename);
//     return fixPath === errorPath && fix.fix_description.includes(error.error.split('\n')[0]);
// }

// // Log a fix
// function logFix(fixData) {
//     fs.appendFileSync(FIXES_LOG_PATH, JSON.stringify(fixData) + os.EOL);
//     console.log(`✅ Logged fix for error at ${fixData.related_error}`);
// }

// // Analyze changes in a file
// function analyzeChange(filePath) {
//     const currentContent = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
//     const previousContent = fileVersions[filePath] || [];

//     const diff = getDiff(previousContent, currentContent);

//     // If there is a diff, check if it fixes a known error
//     if (diff.length > 0) {
//         for (const error of knownErrors) {
//             if (isFixRelatedToError({ file: filePath, fix_description: diff.join(' ') }, error)) {
//                 const fixData = {
//                     timestamp: new Date().toISOString(),
//                     file: filePath,
//                     fix_description: diff.join(' '),
//                     related_error: error.timestamp,
//                     error_message: error.error.split('\n')[0]
//                 };
//                 logFix(fixData);
//             }
//         }
//     }

//     // Update the file content cache
//     fileVersions[filePath] = currentContent;
// }

// // Initialize and start tracking JS fixes
// function startTracking() {
//     loadErrors();

//     // Watch for changes in JavaScript files
//     const watcher = chokidar.watch([
//         path.join(__dirname, '../development/**/*.js'),
//         path.join(__dirname, '../development/**/*.jsx'),
//         path.join(__dirname, '../development/**/*.ts'),
//         path.join(__dirname, '../development/**/*.tsx')
//     ], {
//         ignored: /node_modules/,
//         persistent: true
//     });

//     watcher.on('change', (filePath) => {
//         try {
//             analyzeChange(filePath);
//         } catch (e) {
//             console.error(`❌ Error analyzing ${filePath}: ${e.message}`);
//         }
//     });

//     watcher.on('ready', () => {
//         console.log(`🟢 JS Fix tracker started. Watching: ${path.join(__dirname, '../development/')}`);
//         console.log(`🟡 Loaded ${knownErrors.length} recent errors`);
//     });
// }

// if (require.main === module) {
//     startTracking();
// }


// /data-collector/fix-trackers/track-js-fix.js
const fs = require('fs/promises');
const path = require('path');
const chokidar = require('chokidar');
const { EOL } = require('os');
const { performance } = require('perf_hooks');
const { createHash } = require('crypto');

// Configuration
const CONFIG = {
    PROJECT_ROOT: path.resolve(__dirname, '../../development'),
    ERROR_LOG_PATH: path.join(__dirname, '../collected-data/js-errors.jsonl'),
    FIX_LOG_PATH: path.join(__dirname, '../collected-data/fixes.jsonl'),
    WATCH_PATTERNS: ['**/*.{js,jsx,ts,tsx}'],
    IGNORED_PATTERNS: [
        '**/node_modules/**',
        '**/build/**',
        '**/dist/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/.git/**'
    ],
    MAX_ERRORS_CACHE: 1000,
    DEBOUNCE_DELAY: 300,
    DIFF_CONTEXT_LINES: 3,
    MIN_FIX_CONFIDENCE: 0.7
};

// State management
const state = {
    fileVersions: new Map(),
    errorCache: new Map(),
    processingQueue: new Set(),
    isProcessing: false
};

// Utility functions
const generateErrorSignature = (error) => {
    const hash = createHash('sha256');
    hash.update(`${error.message}|${error.file}|${error.line}`);
    return hash.digest('hex');
};

const getCodeContext = (content, lineNumber, contextSize = CONFIG.DIFF_CONTEXT_LINES) => {
    const lines = content.split('\n');
    const start = Math.max(0, lineNumber - contextSize);
    const end = Math.min(lines.length, lineNumber + contextSize + 1);
    return lines.slice(start, end).join('\n');
};

const calculateFixConfidence = (errorContent, fixContent) => {
    // Simple heuristic - could be replaced with more sophisticated analysis
    const errorTokens = errorContent.split(/\s+/);
    const fixTokens = fixContent.split(/\s+/);
    const commonTokens = new Set([...errorTokens].filter(t => fixTokens.includes(t)));
    return commonTokens.size / Math.max(errorTokens.length, 1);
};

// Data operations
async function loadErrorCache() {
    try {
        if (!fs.existsSync(CONFIG.ERROR_LOG_PATH)) return;

        const data = await fs.readFile(CONFIG.ERROR_LOG_PATH, 'utf-8');
        const errors = data.trim().split('\n')
            .slice(-CONFIG.MAX_ERRORS_CACHE)
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        for (const error of errors) {
            const signature = generateErrorSignature(error);
            state.errorCache.set(signature, {
                ...error,
                signature,
                context: getCodeContext(error.content || '', error.line || 0)
            });
        }

        console.log(`📊 Loaded ${state.errorCache.size} errors into cache`);
    } catch (error) {
        console.error('❌ Failed to load error cache:', error.message);
    }
}

async function logFixRecord(fixData) {
    try {
        const record = {
            ...fixData,
            timestamp: new Date().toISOString(),
            processing_time: performance.now() - fixData.detectedAt
        };

        await fs.appendFile(CONFIG.FIX_LOG_PATH, JSON.stringify(record) + EOL);
        console.log(`✅ Logged fix for ${fixData.errorSignature}`);
        return true;
    } catch (error) {
        console.error('❌ Failed to log fix:', error.message);
        return false;
    }
}

// Diff analysis
async function analyzeFileChanges(filePath) {
    if (state.processingQueue.has(filePath)) return;
    state.processingQueue.add(filePath);

    try {
        const currentContent = await fs.readFile(filePath, 'utf-8');
        const previousContent = state.fileVersions.get(filePath) || '';

        if (currentContent === previousContent) {
            state.processingQueue.delete(filePath);
            return;
        }

        await detectPotentialFixes(filePath, previousContent, currentContent);
        state.fileVersions.set(filePath, currentContent);
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    } finally {
        state.processingQueue.delete(filePath);
    }
}

async function detectPotentialFixes(filePath, oldContent, newContent) {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    const detectedAt = performance.now();

    for (const [errorSignature, error] of state.errorCache) {
        if (path.resolve(error.file) !== path.resolve(filePath)) continue;

        const errorLine = (error.line || 1) - 1; // Convert to 0-based index
        if (errorLine >= oldLines.length || errorLine >= newLines.length) continue;

        const oldLine = oldLines[errorLine];
        const newLine = newLines[errorLine];

        if (oldLine !== newLine) {
            const confidence = calculateFixConfidence(oldLine, newLine);
            if (confidence >= CONFIG.MIN_FIX_CONFIDENCE) {
                const fixData = {
                    errorSignature,
                    file: filePath,
                    line: errorLine + 1,
                    original: oldLine,
                    fixed: newLine,
                    confidence,
                    context: {
                        before: getCodeContext(oldContent, errorLine),
                        after: getCodeContext(newContent, errorLine)
                    },
                    detectedAt,
                    metadata: {
                        project: path.relative(CONFIG.PROJECT_ROOT, filePath).split(path.sep)[0]
                    }
                };

                await logFixRecord(fixData);
                state.errorCache.delete(errorSignature);
            }
        }
    }
}

// File watching
function setupFileWatcher() {
    const watcher = chokidar.watch(
        CONFIG.WATCH_PATTERNS.map(pattern => path.join(CONFIG.PROJECT_ROOT, pattern)),
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
        .on('add', filePath => analyzeFileChanges(filePath))
        .on('change', filePath => analyzeFileChanges(filePath))
        .on('unlink', filePath => state.fileVersions.delete(filePath))
        .on('error', error => console.error('Watcher error:', error));

    return watcher;
}

// Initialization
async function initialize() {
    console.log('🚀 Starting JavaScript Fix Tracker');
    console.log(`📂 Monitoring: ${CONFIG.PROJECT_ROOT}`);
    console.log(`🔍 Watching patterns: ${CONFIG.WATCH_PATTERNS.join(', ')}`);

    try {
        await loadErrorCache();
        const watcher = setupFileWatcher();

        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down fix tracker...');
            await watcher.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
}

// Start the tracker
if (require.main === module) {
    initialize();
}
