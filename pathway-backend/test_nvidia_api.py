import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv('ANTHROPIC_API_KEY')
print(f"API Key present: {bool(api_key)}")
if api_key:
    print(f"API Key start: {api_key[:10]}...")

url = "https://integrate.api.nvidia.com/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "meta/llama-3.1-8b-instruct",
    "messages": [{"role": "user", "content": "Hello, are you working?"}],
    "temperature": 0.5,
    "max_tokens": 100
}

print("\nSending request to Nvidia API...")
try:
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response Success!")
        print(response.json()['choices'][0]['message']['content'])
    else:
        print("Response Failed!")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
