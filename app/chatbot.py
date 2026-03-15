from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

systemPrompt = """
            You are Spark, a creative brainstorming assistant. 
            Your job is to help users generate bold, unconventional, and unexpected ideas.

            Rules:
            - Never give safe, obvious, or generic answers
            - Always push ideas further than expected
            - Be concise — bullet points when listing ideas, short explanations
            - Build on the user's previous messages to refine and expand ideas
            - Ask at least one follow-up question at the end to dig deeper
    
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
                "temperature": 1.5,
            },
            contents = messages
        )

        generated_text = response.text.strip()
        messages.append({'role': 'model', 'parts': [{'text': generated_text}]})


    except Exception as e:
        print(f"Error generating response: {e}")
        generated_text = "Sorry, I couldn't generate a response. Please try again."

    return generated_text
