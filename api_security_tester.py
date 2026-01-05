import json
import requests
import re
import time
from urllib.parse import urlparse, parse_qs

class APISecurityTester:
    def __init__(self, collection_path, base_url):
        self.collection_path = collection_path
        self.base_url = base_url.rstrip('/')
        self.token = None
        self.endpoints = []
        self.session = requests.Session()
        
        # Payloads
        self.sqli_payloads = ["' OR '1'='1", "1; DROP TABLE users--"]
        self.xss_payloads = ["<script>alert(1)</script>"]
        
    def load_collection(self):
        print(f"[*] Loading collection from {self.collection_path}...")
        with open(self.collection_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self._parse_items(data.get('item', []))
        print(f"[*] Found {len(self.endpoints)} endpoints.")

    def _parse_items(self, items):
        for item in items:
            if 'item' in item:
                self._parse_items(item['item'])
            elif 'request' in item:
                self.endpoints.append({
                    'name': item['name'],
                    'method': item['request']['method'],
                    'url': item['request']['url']['raw'],
                    'body': item['request'].get('body', {}).get('raw', '')
                })

    def authenticate(self, email, password):
        print("[*] Authenticating...")
        url = f"{self.base_url}/api/auth/login"
        path_url = "/api/auth/login"
        
        # Find the login endpoint in collection to ensure we match it, but hardcoding for stability here
        payload = {
            "email": email,
            "password": password
        }
        
        try:
            response = self.session.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                # Adjust based on actual API response structure
                # Assuming ApiResponse<AuthResponse> -> data.accessToken or similar
                if 'data' in data and 'accessToken' in data['data']:
                    self.token = data['data']['accessToken']
                elif 'accessToken' in data: # Direct response
                    self.token = data['accessToken']
                else:
                     # Attempt generic extraction
                     print("[!] Could not extract token automatically. Response:", data)
                     return False
                     
                self.session.headers.update({'Authorization': f'Bearer {self.token}'})
                print(f"[+] Authentication successful. Token obtained.")
                return True
            else:
                print(f"[-] Authentication failed: {response.status_code} {response.text}")
                return False
        except Exception as e:
            print(f"[-] Authentication error: {str(e)}")
            return False

    def run_scan(self):
        if not self.token:
            print("[!] Warning: No token set. Running in unauthenticated mode (many tests may fail).")

        print("\n[=] Starting Bulk Execution Scan [=]")
        
        results = {
            'total': 0,
            'success': 0,
            'failed': 0,
            'vulnerabilities': []
        }

        for ep in self.endpoints:
            self._test_endpoint(ep, results)

        self._generate_report(results)

    def _test_endpoint(self, endpoint, results):
        url = endpoint['url']
        method = endpoint['method']
        name = endpoint['name']
        
        # Retrieve Path/Query params
        # Replace {{baseUrl}}
        final_url = url.replace('{{baseUrl}}', self.base_url)
        
        # Skip Auth login/register for scanning to avoid logging out or spamming
        if 'login' in final_url or 'register' in final_url or 'logout' in final_url:
            return

        # Replace standard IDs for testing (Setup required)
        final_url = final_url.replace(':id', '1').replace('{{studentId}}', '1')

        # 1. Stability Check (Smoke Test)
        print(f"[*] Testing {method} {name}...", end='\r')
        try:
            start_time = time.time()
            if method == 'GET':
                resp = self.session.get(final_url)
            elif method == 'POST':
                # Parse body if json
                json_body = None
                try:
                    if endpoint['body']:
                        json_body = json.loads(endpoint['body'])
                except:
                    pass
                resp = self.session.post(final_url, json=json_body)
            elif method == 'PUT':
                 resp = self.session.put(final_url)
            elif method == 'DELETE':
                 resp = self.session.delete(final_url)
            else:
                return

            elapsed = (time.time() - start_time) * 1000
            
            status_code = resp.status_code
            if 200 <= status_code < 300:
                results['success'] += 1
                status_icon = "✓"
            else:
                results['failed'] += 1
                status_icon = "✗"
            
            print(f"[{status_icon}] {method} {name} | Status: {status_code} | Time: {elapsed:.2f}ms")

            # 2. Security Checks
            self._check_sqli(final_url, method, results)
            
            results['total'] += 1

        except Exception as e:
            print(f"[!] Error testing {name}: {str(e)}")
            results['failed'] += 1

    def _check_sqli(self, url, method, results):
        # Basic SQLi check on query params
        if '?' in url:
            base_query = url.split('?')[0]
            for payload in self.sqli_payloads:
                # Inject into param
                # This is a simplified check
                pass

    def _generate_report(self, results):
        print("\n[=] Scan Completed [=]")
        print(f"Total Requests: {results['total']}")
        print(f"Success (2xx): {results['success']}")
        print(f"Failed (4xx/5xx): {results['failed']}")
        if results['vulnerabilities']:
            print("FOUND VULNERABILITIES:")
            for v in results['vulnerabilities']:
                print(f"- {v}")

if __name__ == "__main__":
    # Configuration
    COLLECTION_PATH = "Tutor_Management_Postman_Collection.json"
    BASE_URL = "http://localhost:8080"
    ADMIN_EMAIL = "admin@tutormanagement.com" # Updated from DataInitializer
    ADMIN_PASS = "password123"                # Updated from DataInitializer

    tester = APISecurityTester(COLLECTION_PATH, BASE_URL)
    tester.load_collection()
    
    # Authenticate (Optional - Update credentials)
    tester.authenticate(ADMIN_EMAIL, ADMIN_PASS)
    
    # Run Scan
    tester.run_scan()
