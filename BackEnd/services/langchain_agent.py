from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from core.config import settings
from core.logger import logger

def get_langchain_response(message, context_prompts=None):
    """
    Get response using LangChain with Google Gemini model and temperature 1.
    Optionally provide context_prompts (list of previous user prompts).
    """
    try:
        # Initialize the LangChain model with temperature 1
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=1.0,
            max_output_tokens=1024,
            top_k=40,
            top_p=0.95
        )
        
        # Create system message with instructions
        system_message = SystemMessage(content=(
            "You are a helpful AI assistant that creates Twitter posts. "
            "Always respond with Twitter posts within 300 characters, "
            "using human-style writing, minimum of 3 hashtags, and be precise on the topic."
        ))
        
        # Build conversation history
        messages = [system_message]
        if context_prompts:
            for prompt in context_prompts:
                messages.append(HumanMessage(content=prompt))
        messages.append(HumanMessage(content=message))
        
        # Get response from LangChain
        response = llm.invoke(messages)
        
        return response.content, None
        
    except Exception as e:
        logger.error(f"LangChain request failed: {str(e)}")
        return None, f"LangChain request failed: {str(e)}"

def get_langchain_response_with_custom_instruction(message, instruction):
    """
    Get response using LangChain with custom instruction
    """
    try:
        # Initialize the LangChain model with temperature 1
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=1.0,
            max_output_tokens=1024,
            top_k=40,
            top_p=0.95
        )
        
        # Create system message with custom instruction
        system_message = SystemMessage(content=instruction)
        
        # Create human message with user input
        human_message = HumanMessage(content=message)
        
        # Get response from LangChain
        response = llm.invoke([system_message, human_message])
        
        return response.content, None
        
    except Exception as e:
        logger.error(f"LangChain request failed: {str(e)}")
        return None, f"LangChain request failed: {str(e)}" 