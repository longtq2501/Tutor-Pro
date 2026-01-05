const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    email: "admin@tutormanagement.com",
    password: "password123",
    baseUrl: "http://localhost:8080",
    collectionPath: "./Tutor_Management_Postman_Collection.json"
};

// Colors for console output
const COLORS = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
};

async function main() {
    console.log(`${COLORS.cyan}[*] Starting API Security Tester (Node.js Edition)${COLORS.reset}`);

    // 1. Load Collection
    const endpoints = loadCollection(CONFIG.collectionPath);
    console.log(`${COLORS.cyan}[*] Found ${endpoints.length} endpoints.${COLORS.reset}`);

    // 2. Authenticate
    const token = await authenticate(CONFIG.email, CONFIG.password);
    if (!token) {
        console.warn(`${COLORS.yellow}[!] Running in unauthenticated mode.${COLORS.reset}`);
    } else {
        console.log(`${COLORS.green}[+] Authentication successful.${COLORS.reset}`);
    }

    // 3. Run Scan
    const results = {
        total: 0,
        success: 0,
        failed: 0,
        errors: []
    };

    console.log(`\n${COLORS.cyan}[=] Executing Bulk Scan [=]${COLORS.reset}`);

    for (const ep of endpoints) {
        await testEndpoint(ep, token, results);
    }

    // 4. Report
    printReport(results);
}

function loadCollection(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);
        const endpoints = [];

        function parseItems(items) {
            for (const item of items) {
                if (item.item) {
                    parseItems(item.item);
                } else if (item.request) {
                    endpoints.push({
                        name: item.name,
                        method: item.request.method,
                        url: item.request.url.raw,
                        body: item.request.body?.raw || null
                    });
                }
            }
        }

        if (json.item) parseItems(json.item);
        return endpoints;
    } catch (e) {
        console.error(`${COLORS.red}[!] Failed to load collection: ${e.message}${COLORS.reset}`);
        process.exit(1);
    }
}

async function authenticate(email, password) {
    console.log(`${COLORS.cyan}[*] Authenticating...${COLORS.reset}`);
    try {
        const response = await fetch(`${CONFIG.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Try to extract token from common patterns
            return data.accessToken || data.token || data.data?.accessToken;
        } else {
            console.error(`${COLORS.red}[-] Login failed: ${response.status} ${response.statusText}${COLORS.reset}`);
            return null;
        }
    } catch (e) {
        console.error(`${COLORS.red}[-] Auth error: ${e.message}${COLORS.reset}`);
        return null;
    }
}

async function testEndpoint(endpoint, token, results) {
    let url = endpoint.url.replace('{{baseUrl}}', CONFIG.baseUrl);

    // Skip auth endpoints during scan
    if (url.includes('/login') || url.includes('/register') || url.includes('/logout')) return;

    // Parameter substitution
    url = url.replace(':id', '1')
        .replace('{{id}}', '1')
        .replace('{{studentId}}', '1');

    // Remove remaining {{...}} placeholders
    url = url.replace(/\{\{.*?\}\}/g, '1');

    const method = endpoint.method;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Special handling for Upload Document to simulate missing part (for 400 bad request test)
    // or just avoid 415 Unsupported Media Type by NOT sending json header
    if (url.includes('/api/documents') && method === 'POST') {
        // Do not set Content-Type: application/json
        // Let fetch handle multipart boundary if we were keeping body, 
        // but for this test we want to send an empty body to trigger 400 Bad Request (Missing Part)
        // implying "multipart/form-data" but empty
        // However, fetch requires a FormData object to set multipart header automatically.
        // If we send nothing, it might be text/plain.
        // Let's force a boundary or mock it? 
        // Simpler: Just skip JSON header.
    } else {
        headers['Content-Type'] = 'application/json';
    }

    const start = performance.now();
    try {
        // Prepare options
        const options = { method, headers };
        if (endpoint.body && (method === 'POST' || method === 'PUT')) {
            if (!url.includes('/api/documents')) {
                try {
                    options.body = endpoint.body;
                } catch (e) { }
            }
        }

        const response = await fetch(url, options);
        const duration = (performance.now() - start).toFixed(2);

        const status = response.status;
        const isSuccess = status >= 200 && status < 300;

        const color = isSuccess ? COLORS.green : COLORS.red;
        const icon = isSuccess ? "✓" : "✗";

        console.log(`${color}[${icon}] ${method} ${endpoint.name} | ${status} | ${duration}ms${COLORS.reset}`);

        results.total++;
        if (isSuccess) results.success++;
        else {
            results.failed++;
            results.errors.push(`${method} ${endpoint.name}: ${status}`);
        }

    } catch (e) {
        console.log(`${COLORS.red}[!] Error ${endpoint.name}: ${e.message}${COLORS.reset}`);
        results.total++;
        results.failed++;
    }
}

function printReport(results) {
    console.log(`\n${COLORS.cyan}[=] Scan Report [=]${COLORS.reset}`);
    console.log(`Total Requests: ${results.total}`);
    console.log(`${COLORS.green}Success: ${results.success}${COLORS.reset}`);
    console.log(`${COLORS.red}Failed: ${results.failed}${COLORS.reset}`);

    if (results.errors.length > 0) {
        console.log(`\n${COLORS.yellow}Failed Endpoints:${COLORS.reset}`);
        results.errors.slice(0, 10).forEach(e => console.log(`- ${e}`));
        if (results.errors.length > 10) console.log(`...and ${results.errors.length - 10} more.`);
    }
}

main().catch(console.error);
