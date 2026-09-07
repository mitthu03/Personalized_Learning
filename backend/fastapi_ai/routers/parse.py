from fastapi import APIRouter, File, HTTPException, UploadFile
from pypdf import PdfReader
from docx import Document

from schemas import ParsedProfile, ParseTextRequest
from services.skill_extractor import parse_profile

router = APIRouter()


@router.post("/parse", response_model=ParsedProfile)
async def parse_file(file: UploadFile = File(...)) -> dict:
    content = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = extract_pdf_text(content)
    elif filename.endswith(".docx"):
        text = extract_docx_text(content)
    elif filename.endswith(".txt"):
        text = content.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT.")

    return parse_profile(text)


@router.post("/parse-text", response_model=ParsedProfile)
def parse_text(payload: ParseTextRequest) -> dict:
    return parse_profile(payload.text)


def extract_pdf_text(content: bytes) -> str:
    from io import BytesIO

    reader = PdfReader(BytesIO(content))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def extract_docx_text(content: bytes) -> str:
    from io import BytesIO

    document = Document(BytesIO(content))
    return "\n".join(paragraph.text for paragraph in document.paragraphs)
