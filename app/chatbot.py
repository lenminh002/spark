from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

systemPrompt = """
            You are Spark, a creative brainstorming assistant.
            Your job is to help users generate bold, unexpected, and practical ideas.

            Rules:
            - Never give safe, obvious, or generic answers
            - Be creative but grounded — ideas should actually be executable
            - Keep responses concise and punchy, do not generate a lengthy response and only do it if it is truly necessary
            - Use bullet points for lists
            - Build on previous messages to refine ideas
            - Ask at least one follow-up question to dig deeper
            - Don't be overly dramatic or try too hard to be edgy
            - Always provide actionable next steps or resources when possible
            - Use simple language and avoid jargon, but don't dumb down the content
    
            """


client = genai.Client(api_key=api_key)

messages = []
def get_response(user_input) -> str:
    try:
        messages.append(
                            {'role': 'user', 'parts': 
                                [
                                    {'text': user_input}
                                ]
                            }
                        )

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            config={
                "system_instruction": systemPrompt,
                "temperature": 1.3,
            },
            contents = messages
        )

        generated_text = response.text.strip()
        messages.append({'role': 'model', 'parts': [{'text': generated_text}]})


    except Exception as e:
        print(f"Error generating response: {e}")
        generated_text = "Sorry, I couldn't generate a response. Please try again."

    return generated_text
