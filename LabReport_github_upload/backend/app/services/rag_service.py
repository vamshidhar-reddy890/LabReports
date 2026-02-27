from functools import lru_cache
from pathlib import Path
from typing import List

from app.config import resolve_path, settings


@lru_cache(maxsize=1)
def _build_retriever():
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_community.embeddings import FakeEmbeddings
        from langchain_community.vectorstores import Chroma
    except Exception:
        return None

    kb_path = Path(resolve_path(settings.knowledge_base_path))
    if not kb_path.exists():
        return None

    content = kb_path.read_text(encoding="utf-8")
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=80)
    chunks = splitter.split_text(content)
    if not chunks:
        return None

    embeddings = FakeEmbeddings(size=256)
    vectorstore = Chroma.from_texts(texts=chunks, embedding=embeddings)
    return vectorstore.as_retriever(search_kwargs={"k": 3})


def retrieve_context(test_name: str, status: str) -> str:
    retriever = _build_retriever()
    if not retriever:
        return ""
    query = f"Explain {test_name} with status {status} in patient-friendly language"
    docs = retriever.get_relevant_documents(query)
    snippets: List[str] = [d.page_content.strip() for d in docs if d.page_content.strip()]
    return "\n".join(snippets[:3])
