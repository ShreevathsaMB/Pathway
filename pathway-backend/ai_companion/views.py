import os
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ChatListView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            user=user, 
            companion_name=user.ai_companion_name,
            language=user.language_preference
        )

class ChatDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            content = request.data.get('content')
            
            if not content:
                return Response({'error': 'Message content is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # 1. Save user message
            user_message = Message.objects.create(
                conversation=conversation,
                role='user',
                content=content
            )
            
            # 2. Get AI response (Claude)
            ai_response_content = self.get_claude_response(conversation, content)
            
            # 3. Save AI message
            ai_message = Message.objects.create(
                conversation=conversation,
                role='assistant',
                content=ai_response_content
            )
            
            return Response(MessageSerializer(ai_message).data, status=status.HTTP_201_CREATED)
            
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    def get_claude_response(self, conversation, user_input):
        import sys
        print(f"DEBUG: Starting Nvidia API call for user {conversation.user.email}", file=sys.stderr)
        
        api_key = os.environ.get('ANTHROPIC_API_KEY')
        print(f"DEBUG: API Key present: {bool(api_key)}", file=sys.stderr)
        
        if not api_key or api_key == 'your-anthropic-api-key-here':
            print("ERROR: API Key missing or default", file=sys.stderr)
            return "Configuration Error: API Key is missing. Please check backend .env file."

        try:
            # Nvidia API uses OpenAI-compatible format
            import requests
            
            # Get conversation history
            history = conversation.get_message_history_for_api()
            print(f"DEBUG: History length: {len(history)}", file=sys.stderr)
            
            # Build messages array for Nvidia API
            messages = []
            
            # System message
            system_content = f"Your name is {conversation.companion_name}. You are a supportive mental wellness companion for the Pathway app. "
            system_content += f"Respond in {conversation.get_language_display()}. "
            system_content += "Be empathetic, non-judgmental, and warm. Use simple, clear language. "
            system_content += "When giving advice, solutions, or answering questions, always format your response in a clear, structured way: "
            system_content += "use numbered lists or bullet points (markdown format) to make it easy to read, one point per idea. "
            system_content += "Start with a brief empathetic sentence, then give your structured response. "
            system_content += "Keep each point short and actionable. Use **bold** for key terms when helpful. "
            system_content += "For purely conversational replies (e.g. the user says 'hi' or 'thanks'), respond naturally without a list. "
            system_content += "If the user mentions self-harm or severe crisis, gently suggest contacting professional help immediately."

            
            messages.append({"role": "system", "content": system_content})
            
            # Add conversation history
            for msg in history:
                messages.append({"role": msg['role'], "content": msg['content']})
            
            # Add current user message
            messages.append({"role": "user", "content": user_input})
            
            # Call Nvidia API (OpenAI-compatible endpoint)
            print("DEBUG: Sending request to Nvidia API...", file=sys.stderr)
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
                    "max_tokens": 600
                },
                timeout=30
            )
            
            print(f"DEBUG: Nvidia API Response Status: {response.status_code}", file=sys.stderr)
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                print("DEBUG: Success! Response received.", file=sys.stderr)
                return content
            else:
                print(f"ERROR: Nvidia API Error: {response.status_code} - {response.text}", file=sys.stderr)
                return f"AI Error ({response.status_code}): {response.text[:100]}..."
                
        except Exception as e:
            print(f"ERROR: Exception in AI API: {str(e)}", file=sys.stderr)
            import traceback
            traceback.print_exc()
            return f"System Error: {str(e)}"
