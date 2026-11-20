import requests
import os

# Manual .env reader
try:
    with open('.env', 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'): continue
            if 'ANTHROPIC_API_KEY' in line:
                key = line.split('=')[1].strip().strip('"').strip("'")
                os.environ['ANTHROPIC_API_KEY'] = key
except Exception as e:
    print(f"Error reading .env: {e}")

api_key = os.environ.get('ANTHROPIC_API_KEY')

print(f"API Key present: {bool(api_key)}")
if api_key:
    # Print first few chars to verify we got the right one
    print(f"API Key start: {api_key[:15]}...")

url = "https://integrate.api.nvidia.com/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Payload for Llama 3.1 8B Instruct
payload = {
    "model": "meta/llama-3.1-8b-instruct",
    "messages": [{"role": "user", "content": "Hello! Just say 'maintain' if you can hear me."}],
    "temperature": 0.5,
    "top_p": 1,
    "max_tokens": 100
}

print("\nSending request to Nvidia API...")
try:
    response = requests.post(url, headers=headers, json=payload, timeout=20)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Request Error: {e}")
