from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage
import logging
import traceback

# تنظیم لاگینگ
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class OpenAIService:
    def __init__(self, api_key):
        try:
            # راه‌اندازی ChatOpenAI با پارامترهای مشخص
            self.llm = ChatOpenAI(
                model="gpt-3.5-turbo",
                base_url="https://api.avalai.ir/v1",
                api_key=api_key
            )
            logger.info("سرویس OpenAI با موفقیت راه‌اندازی شد")
        except Exception as e:
            logger.error(f"خطا در راه‌اندازی سرویس: {e}")
            raise

    def generate_response(self, prompt):
        try:
            logger.debug(f"درخواست پاسخ برای پرامپت: {prompt}")

            # تولید پاسخ با استفاده از Langchain
            response = self.llm.invoke(
                f"خیلی صمیمی و طبیعی با کاربر تعامل کن لطفا: {prompt}"
            )

            # تبدیل AIMessage به متن ساده
            if isinstance(response, AIMessage):
                response = response.content

            logger.info(f"پاسخ دریافت شد: {response[:100]}...")
            return response

        except Exception as e:
            logger.error(f"خطای کامل: {str(e)}")
            logger.error(traceback.format_exc())
            raise