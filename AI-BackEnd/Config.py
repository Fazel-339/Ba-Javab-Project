from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv('AVALAI_API_KEY')
    MONGODB_URI = os.getenv('MONGODB_URI')
