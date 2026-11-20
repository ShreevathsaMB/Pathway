import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pathway.settings')
django.setup()

import requests
from ai_companion.models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()

# Get the first user and conversation
try:
    user = User.objects.first()
    if not user:
        print("No users found.")
        exit()
        
    conversation = Conversation.objects.filter(user=user).first()
    if not conversation:
        print("No conversation found. Creating one...")
        conversation = Conversation.objects.create(
            user=user,
            companion_name=user.ai_companion_name or "AI Friend",
            language=user.language_preference
        )
except Exception as e:
    print(f"Error getting user/conversation: {e}")
    exit()

print(f"Testing with User: {user.email}")
print(f"Conversation ID: {conversation.id}")

api_key = os.environ.get('ANTHROPIC_API_KEY')
print(f"API Key present: {bool(api_key)}")
if api_key:
    print(f"API Key start: {api_key[:10]}...")

# Simulate get_claude_response logic
try:
    history = conversation.get_message_history_for_api()
    print(f"History length: {len(history)}")
    
    messages = []
    
    # System message
    system_content = f"Your name is {conversation.companion_name}. You are a supportive mental wellness companion for the Pathway app. "
    system_content += f"Respond in {conversation.get_language_display()}. "
    system_content += "Be empathetic, non-judgmental, and helpful. Use simple language. "
    system_content += "If the user mentions self-harm or severe crisis, suggest contacting professional help immediately."
    
    messages.append({"role": "system", "content": system_content})
    
    for msg in history:
        # Check if msg structure is correct
        if 'role' not in msg or 'content' not in msg:
            print(f"Invalid message format in history: {msg}")
            continue
        messages.append({"role": msg['role'], "content": msg['content']})
    
    messages.append({"role": "user", "content": "Hello, this is a test from Django shell."})
    
    print("\nRequest Payload Messages:")
    for m in messages:
        print(f"- {m['role']}: {m['content'][:50]}...")

    print("\nSending request...")
    response = requests.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta/llama-3.1-8b-instruct",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1000
        },
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        content = result['choices'][0]['message']['content']
        print("\nSuccess! AI Response:")
        print(content)
    else:
        print("\nFailed!")
        print(response.text)

except Exception as e:
    print(f"\nException during execution: {e}")
