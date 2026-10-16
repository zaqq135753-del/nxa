---
name: rag-systems
description: >-
  Retrieval-Augmented Generation: text chunking, embedding generation with pgvector, cosine similarity queries, and grounded context injection.
---

# RAG Systems Architecture

## Diretrizes
- Divisão semântica de documentos (*chunking*) preservando o contexto dos parágrafos.
- Busca vetorial com PostgreSQL pgvector e ordenação por similaridade de cossenos.
