#!/usr/bin/env python3
"""
Local Blog Content & Semantic Topic Analyzer.

Scans all files in a blog directory, extracts metadata/headings/URLs/keywords,
computes TF-IDF + LSA semantic embeddings, and identifies:
  1. Semantically similar blogs discussing the same topics
  2. Near-duplicate articles (even when titles differ)
  3. Individual blogs covering multiple unrelated topics (section-level dispersion)
  4. Topic clusters across the entire blog corpus

Outputs a console summary, a structured JSON report, and a Markdown report.
"""

from __future__ import annotations

import argparse
import json
import math
import re
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import numpy as np
import yaml

DEFAULT_BLOG_DIR = Path("/Users/sanskar/Documents/Asellus/Audiment/content/blog")
DEFAULT_OUT_DIR = Path("/Users/sanskar/Documents/Asellus/Audiment/scripts/output")

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "also", "am", "an",
    "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before",
    "being", "below", "between", "both", "but", "by", "can", "can't", "cannot",
    "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "even", "few", "for", "from", "further", "get", "gets",
    "getting", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he",
    "her", "here", "hers", "herself", "him", "himself", "his", "how", "however",
    "i", "if", "in", "into", "is", "isn't", "it", "its", "itself", "just", "let's",
    "like", "many", "may", "me", "might", "more", "most", "much", "must", "mustn't",
    "my", "myself", "need", "no", "nor", "not", "now", "of", "off", "on", "once",
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
    "own", "per", "same", "shall", "she", "should", "shouldn't", "so", "some",
    "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
    "there", "these", "they", "this", "those", "through", "to", "too", "under",
    "until", "up", "use", "used", "using", "very", "was", "wasn't", "we", "were",
    "weren't", "what", "when", "where", "which", "while", "who", "whom", "why",
    "will", "with", "within", "without", "won't", "would", "wouldn't", "you",
    "your", "yours", "yourself", "yourselves", "one", "two", "three", "first",
    "second", "new", "make", "makes", "made", "way", "well", "via", "etc",
}


@dataclass
class BlogDocument:
    """Structured representation of a single blog file."""

    file_path: str
    filename: str
    slug: str
    url: str
    title: str
    meta_title: str
    description: str
    category: str
    tags: list[str]
    headings: list[dict[str, Any]]
    embedded_urls: list[str]
    body_text: str
    sections: list[dict[str, str]]
    extracted_keywords: list[str] = field(default_factory=list)
    word_count: int = 0


def parse_frontmatter(raw_text: str) -> tuple[dict[str, Any], str]:
    """Split YAML frontmatter from markdown/MDX body."""
    if raw_text.startswith("---"):
        parts = raw_text.split("---", 2)
        if len(parts) >= 3:
            try:
                data = yaml.safe_load(parts[1]) or {}
                if isinstance(data, dict):
                    return data, parts[2].strip()
            except yaml.YAMLError:
                pass
    return {}, raw_text.strip()


def clean_markdown_text(text: str) -> str:
    """Strip code blocks, MDX/HTML tags, URLs, and markdown formatting for NLP."""
    # Remove fenced code blocks
    text = re.sub(r"```[\s\S]*?```", " ", text)
    # Remove inline code
    text = re.sub(r"`[^`]+`", " ", text)
    # Remove JSX/HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Replace markdown links [label](url) with label
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Remove bare URLs
    text = re.sub(r"https?://\S+", " ", text)
    # Remove markdown table separators and symbols
    text = re.sub(r"[|*_~>#\[\]{}()]+", " ", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_headings(body: str) -> list[dict[str, Any]]:
    """Extract markdown headings outside fenced code blocks."""
    headings: list[dict[str, Any]] = []
    in_code = False
    for line in body.splitlines():
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = re.match(r"^(#{1,6})\s+(.+?)\s*$", stripped)
        if m:
            headings.append({"level": len(m.group(1)), "text": m.group(2).strip()})
    return headings


def extract_urls(body: str) -> list[str]:
    """Extract unique markdown link targets and bare HTTP(S) URLs."""
    urls: list[str] = []
    seen: set[str] = set()
    for match in re.findall(r"\[[^\]]*\]\(([^)\s]+)\)", body):
        u = match.strip()
        if u and not u.startswith("#") and u not in seen:
            seen.add(u)
            urls.append(u)
    for match in re.findall(r"https?://[^\s)>\"']+", body):
        u = match.strip().rstrip(".,;:")
        if u and u not in seen:
            seen.add(u)
            urls.append(u)
    return urls


def split_sections(body: str) -> list[dict[str, str]]:
    """Split markdown body into sections by H2 (fallback H3) headings."""
    lines = body.splitlines()
    sections: list[dict[str, str]] = []
    current_heading = "Introduction"
    current_lines: list[str] = []
    in_code = False

    has_h2 = any(re.match(r"^##\s+", l.strip()) for l in lines)
    heading_pattern = r"^##\s+(.+)$" if has_h2 else r"^###\s+(.+)$"

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
        if not in_code:
            m = re.match(heading_pattern, stripped)
            if m:
                text = clean_markdown_text("\n".join(current_lines))
                if len(text.split()) >= 25:
                    sections.append({"heading": current_heading, "text": text})
                current_heading = m.group(1).strip()
                current_lines = []
                continue
        current_lines.append(line)

    tail_text = clean_markdown_text("\n".join(current_lines))
    if len(tail_text.split()) >= 25:
        sections.append({"heading": current_heading, "text": tail_text})
    return sections


def parse_blog_file(path: Path) -> BlogDocument:
    """Parse a single .md or .mdx blog file into a BlogDocument."""
    raw = path.read_text(encoding="utf-8", errors="replace")
    fm, body = parse_frontmatter(raw)
    headings = extract_headings(body)
    slug = path.stem
    canonical_url = f"/blog/{slug}"

    title = str(fm.get("title") or "").strip()
    if not title:
        h1 = next((h["text"] for h in headings if h["level"] == 1), "")
        title = h1 or slug.replace("-", " ").title()

    meta_title = str(fm.get("metaTitle") or title).strip()
    description = str(fm.get("description") or fm.get("excerpt") or "").strip()
    if not description:
        # Fallback to first substantial paragraph
        for para in body.split("\n\n"):
            cleaned = clean_markdown_text(para)
            if len(cleaned.split()) >= 10 and not para.strip().startswith("#"):
                description = cleaned[:260]
                break

    raw_tags = fm.get("tags") or []
    if isinstance(raw_tags, str):
        tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
    elif isinstance(raw_tags, list):
        tags = [str(t).strip() for t in raw_tags if str(t).strip()]
    else:
        tags = []

    category = str(fm.get("category") or "").strip()
    cleaned_body = clean_markdown_text(body)
    sections = split_sections(body)
    embedded_urls = extract_urls(body)

    return BlogDocument(
        file_path=str(path),
        filename=path.name,
        slug=slug,
        url=canonical_url,
        title=title,
        meta_title=meta_title,
        description=description,
        category=category,
        tags=tags,
        headings=headings,
        embedded_urls=embedded_urls,
        body_text=cleaned_body,
        sections=sections,
        word_count=len(cleaned_body.split()),
    )


def tokenize(text: str, include_bigrams: bool = True) -> list[str]:
    """Tokenize text into lowercase unigrams and optional bigrams."""
    words = re.findall(r"[a-z][a-z0-9\-]{1,}", text.lower())
    unigrams = [w.strip("-") for w in words if len(w.strip("-")) >= 2 and w not in STOPWORDS]
    if not include_bigrams:
        return unigrams
    bigrams = [f"{unigrams[i]} {unigrams[i+1]}" for i in range(len(unigrams) - 1)]
    return unigrams + bigrams


class TfidfLsaVectorizer:
    """Zero-dependency TF-IDF + Truncated SVD (LSA) semantic vectorizer."""

    def __init__(self, min_df: int = 2, max_df_ratio: float = 0.85, n_components: int = 80):
        self.min_df = min_df
        self.max_df_ratio = max_df_ratio
        self.n_components = n_components
        self.vocab: dict[str, int] = {}
        self.inv_vocab: list[str] = []
        self.idf: np.ndarray | None = None
        self.vt_components: np.ndarray | None = None

    def fit_transform(self, texts: list[str]) -> tuple[np.ndarray, np.ndarray]:
        """Fit vocabulary/IDF/SVD on corpus and return (tfidf_matrix, lsa_matrix)."""
        n_docs = len(texts)
        doc_tokens = [tokenize(t, include_bigrams=True) for t in texts]

        df: Counter[str] = Counter()
        for toks in doc_tokens:
            df.update(set(toks))

        max_df = max(2, int(self.max_df_ratio * n_docs))
        kept_terms = sorted(
            term for term, count in df.items() if self.min_df <= count <= max_df
        )
        self.inv_vocab = kept_terms
        self.vocab = {term: idx for idx, term in enumerate(kept_terms)}
        n_terms = len(kept_terms)

        self.idf = np.array(
            [math.log((1.0 + n_docs) / (1.0 + df[t])) + 1.0 for t in kept_terms],
            dtype=np.float64,
        )

        tfidf = self._build_tfidf_matrix(doc_tokens, n_terms)

        # Truncated SVD for Latent Semantic Analysis
        u, s, vt = np.linalg.svd(tfidf, full_matrices=False)
        k = min(self.n_components, len(s))
        self.vt_components = vt[:k, :]
        lsa = u[:, :k] * s[:k]
        lsa = row_normalize(lsa)
        return tfidf, lsa

    def transform(self, texts: list[str]) -> tuple[np.ndarray, np.ndarray]:
        """Project new texts (e.g. sections) into the fitted TF-IDF and LSA spaces."""
        assert self.idf is not None and self.vt_components is not None
        doc_tokens = [tokenize(t, include_bigrams=True) for t in texts]
        tfidf = self._build_tfidf_matrix(doc_tokens, len(self.inv_vocab))
        lsa = tfidf @ self.vt_components.T
        lsa = row_normalize(lsa)
        return tfidf, lsa

    def _build_tfidf_matrix(self, doc_tokens: list[list[str]], n_terms: int) -> np.ndarray:
        assert self.idf is not None
        mat = np.zeros((len(doc_tokens), n_terms), dtype=np.float64)
        for row_idx, toks in enumerate(doc_tokens):
            counts = Counter(t for t in toks if t in self.vocab)
            for term, cnt in counts.items():
                col_idx = self.vocab[term]
                # Sublinear TF scaling
                mat[row_idx, col_idx] = (1.0 + math.log(cnt)) * self.idf[col_idx]
        return row_normalize(mat)


def row_normalize(mat: np.ndarray) -> np.ndarray:
    """L2-normalize each row of a 2D array safely."""
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1.0, norms)
    return mat / norms


def spherical_kmeans(
    embeddings: np.ndarray, k: int, n_init: int = 10, max_iter: int = 50, seed: int = 42
) -> tuple[np.ndarray, np.ndarray]:
    """Spherical K-Means clustering on L2-normalized embeddings."""
    rng = np.random.default_rng(seed)
    n_samples = embeddings.shape[0]
    best_labels = np.zeros(n_samples, dtype=int)
    best_centroids = np.zeros((k, embeddings.shape[1]), dtype=np.float64)
    best_inertia = -np.inf

    for _ in range(n_init):
        # K-means++ style initialization using cosine distance
        first_idx = int(rng.integers(0, n_samples))
        centroids = [embeddings[first_idx]]
        for _ in range(1, k):
            c_mat = np.vstack(centroids)
            sims = embeddings @ c_mat.T
            max_sims = sims.max(axis=1)
            dists = np.maximum(0.0, 1.0 - max_sims)
            probs = dists ** 2
            total = probs.sum()
            if total <= 0:
                next_idx = int(rng.integers(0, n_samples))
            else:
                next_idx = int(rng.choice(n_samples, p=probs / total))
            centroids.append(embeddings[next_idx])
        c_mat = np.vstack(centroids)

        labels = np.zeros(n_samples, dtype=int)
        for _ in range(max_iter):
            sims = embeddings @ c_mat.T
            new_labels = sims.argmax(axis=1)
            if np.array_equal(new_labels, labels):
                break
            labels = new_labels
            for cid in range(k):
                mask = labels == cid
                if np.any(mask):
                    c_mat[cid] = embeddings[mask].mean(axis=0)
                else:
                    c_mat[cid] = embeddings[int(rng.integers(0, n_samples))]
            c_mat = row_normalize(c_mat)

        inertia = float((embeddings @ c_mat.T)[np.arange(n_samples), labels].sum())
        if inertia > best_inertia:
            best_inertia = inertia
            best_labels = labels
            best_centroids = c_mat

    return best_labels, best_centroids


def silhouette_score_cosine(embeddings: np.ndarray, labels: np.ndarray) -> float:
    """Compute mean silhouette score using cosine distance (1 - cosine_sim)."""
    sim_mat = embeddings @ embeddings.T
    dist_mat = np.maximum(0.0, 1.0 - sim_mat)
    unique_labels = np.unique(labels)
    if len(unique_labels) < 2:
        return 0.0

    scores = []
    for i in range(len(labels)):
        own_label = labels[i]
        own_mask = labels == own_label
        own_count = int(own_mask.sum())
        if own_count <= 1:
            scores.append(0.0)
            continue
        a_i = float((dist_mat[i, own_mask].sum()) / (own_count - 1))
        b_i = np.inf
        for other_label in unique_labels:
            if other_label == own_label:
                continue
            other_mask = labels == other_label
            mean_d = float(dist_mat[i, other_mask].mean())
            if mean_d < b_i:
                b_i = mean_d
        denom = max(a_i, b_i)
        scores.append((b_i - a_i) / denom if denom > 0 else 0.0)
    return float(np.mean(scores))


def title_jaccard_similarity(t1: str, t2: str) -> float:
    """Token Jaccard similarity between two titles."""
    s1 = set(tokenize(t1, include_bigrams=False))
    s2 = set(tokenize(t2, include_bigrams=False))
    if not s1 or not s2:
        return 0.0
    return len(s1 & s2) / len(s1 | s2)


def analyze_corpus(
    blog_dir: Path,
    out_dir: Path,
    n_clusters: int | None = None,
    sim_threshold: float = 0.72,
    dup_sem_threshold: float = 0.85,
    dup_tfidf_threshold: float = 0.35,
) -> dict[str, Any]:
    """Run the full 6-step blog analysis pipeline."""
    files = sorted(
        p for p in blog_dir.iterdir()
        if p.is_file() and p.suffix.lower() in {".md", ".mdx"}
    )
    if not files:
        raise FileNotFoundError(f"No markdown/MDX files found in {blog_dir}")

    docs = [parse_blog_file(p) for p in files]
    n_docs = len(docs)

    # Combine title + description + tags + headings + body for full semantic representation
    full_texts = []
    body_only_texts = []
    for d in docs:
        heading_text = " ".join(h["text"] for h in d.headings)
        tag_text = " ".join(d.tags)
        combined = f"{d.title} {d.title} {d.description} {tag_text} {heading_text} {d.body_text}"
        full_texts.append(combined)
        body_only_texts.append(d.body_text or d.title)

    # Fit TF-IDF + LSA on full texts
    vectorizer = TfidfLsaVectorizer(min_df=2, max_df_ratio=0.85, n_components=80)
    tfidf_full, lsa_full = vectorizer.fit_transform(full_texts)

    # Extract top 8 TF-IDF keywords per document
    for idx, doc in enumerate(docs):
        row = tfidf_full[idx]
        top_indices = np.argsort(row)[::-1][:8]
        doc.extracted_keywords = [
            vectorizer.inv_vocab[i] for i in top_indices if row[i] > 0
        ]

    # Fit separate body-only TF-IDF for near-duplicate detection independent of title
    body_vec = TfidfLsaVectorizer(min_df=2, max_df_ratio=0.85, n_components=80)
    tfidf_body, lsa_body = body_vec.fit_transform(body_only_texts)

    sem_sim_mat = lsa_full @ lsa_full.T
    tfidf_sim_mat = tfidf_full @ tfidf_full.T
    body_tfidf_sim_mat = tfidf_body @ tfidf_body.T
    body_sem_sim_mat = lsa_body @ lsa_body.T

    # Step 3 & 4: Similar topic pairs & Near-duplicates (especially with differing titles)
    similar_pairs: list[dict[str, Any]] = []
    near_duplicates: list[dict[str, Any]] = []

    for i in range(n_docs):
        for j in range(i + 1, n_docs):
            sem_sim = float(sem_sim_mat[i, j])
            tfidf_sim = float(tfidf_sim_mat[i, j])
            body_tfidf_sim = float(body_tfidf_sim_mat[i, j])
            body_sem_sim = float(body_sem_sim_mat[i, j])
            t_sim = title_jaccard_similarity(docs[i].title, docs[j].title)

            is_near_dup = (
                (body_sem_sim >= dup_sem_threshold and body_tfidf_sim >= dup_tfidf_threshold)
                or body_tfidf_sim >= 0.50
            )
            if is_near_dup:
                near_duplicates.append({
                    "doc_a": {"filename": docs[i].filename, "title": docs[i].title, "url": docs[i].url},
                    "doc_b": {"filename": docs[j].filename, "title": docs[j].title, "url": docs[j].url},
                    "semantic_similarity": round(sem_sim, 4),
                    "body_tfidf_similarity": round(body_tfidf_sim, 4),
                    "title_similarity": round(t_sim, 4),
                    "different_titles": t_sim < 0.45,
                })
            elif sem_sim >= sim_threshold:
                similar_pairs.append({
                    "doc_a": {"filename": docs[i].filename, "title": docs[i].title, "url": docs[i].url},
                    "doc_b": {"filename": docs[j].filename, "title": docs[j].title, "url": docs[j].url},
                    "semantic_similarity": round(sem_sim, 4),
                    "tfidf_similarity": round(tfidf_sim, 4),
                    "title_similarity": round(t_sim, 4),
                })

    near_duplicates.sort(
        key=lambda x: (x["different_titles"], x["body_tfidf_similarity"]), reverse=True
    )
    similar_pairs.sort(key=lambda x: x["semantic_similarity"], reverse=True)

    # Step 5: Identify individual blogs covering multiple unrelated topics
    multi_topic_blogs: list[dict[str, Any]] = []
    for doc in docs:
        if len(doc.sections) < 3:
            continue
        sec_texts = [f"{s['heading']} {s['text']}" for s in doc.sections]
        _, sec_lsa = vectorizer.transform(sec_texts)
        sec_sim = sec_lsa @ sec_lsa.T
        n_sec = len(doc.sections)

        pair_sims: list[tuple[float, int, int]] = []
        for a in range(n_sec):
            for b in range(a + 1, n_sec):
                pair_sims.append((float(sec_sim[a, b]), a, b))

        vals = [p[0] for p in pair_sims]
        mean_sim = float(np.mean(vals))
        min_sim, min_a, min_b = min(pair_sims, key=lambda x: x[0])
        low_ratio = sum(1 for v in vals if v < 0.55) / len(vals)

        # Flag blogs with low intra-document section coherence
        if mean_sim < 0.75 or min_sim < 0.35:
            multi_topic_blogs.append({
                "filename": doc.filename,
                "title": doc.title,
                "url": doc.url,
                "section_count": n_sec,
                "mean_section_similarity": round(mean_sim, 4),
                "min_section_similarity": round(min_sim, 4),
                "low_similarity_pair_ratio": round(low_ratio, 4),
                "most_divergent_sections": [
                    doc.sections[min_a]["heading"],
                    doc.sections[min_b]["heading"],
                ],
            })

    multi_topic_blogs.sort(key=lambda x: x["mean_section_similarity"])

    # Step 6: Topic Clustering via Spherical K-Means + Silhouette Selection
    if n_clusters is None:
        best_k = 12
        best_score = -1.0
        for candidate_k in range(10, min(23, n_docs)):
            lbls, _ = spherical_kmeans(lsa_full, candidate_k, n_init=8, seed=42)
            score = silhouette_score_cosine(lsa_full, lbls)
            if score > best_score:
                best_score = score
                best_k = candidate_k
        chosen_k = best_k
    else:
        chosen_k = min(n_clusters, n_docs)

    cluster_labels, cluster_centroids = spherical_kmeans(lsa_full, chosen_k, n_init=15, seed=42)
    sil_score = silhouette_score_cosine(lsa_full, cluster_labels)

    clusters: list[dict[str, Any]] = []
    for cid in range(chosen_k):
        member_indices = [i for i, lbl in enumerate(cluster_labels) if lbl == cid]
        if not member_indices:
            continue
        centroid_tfidf = tfidf_full[member_indices].mean(axis=0)
        top_term_idx = np.argsort(centroid_tfidf)[::-1][:6]
        top_terms = [vectorizer.inv_vocab[t] for t in top_term_idx if centroid_tfidf[t] > 0]

        sims_to_centroid = lsa_full[member_indices] @ cluster_centroids[cid]
        cohesion = float(np.mean(sims_to_centroid))

        members = []
        for idx, sim_c in sorted(
            zip(member_indices, sims_to_centroid), key=lambda x: x[1], reverse=True
        ):
            members.append({
                "filename": docs[idx].filename,
                "title": docs[idx].title,
                "url": docs[idx].url,
                "category": docs[idx].category,
                "centroid_similarity": round(float(sim_c), 4),
            })

        clusters.append({
            "cluster_id": cid + 1,
            "label": " / ".join(top_terms[:4]),
            "top_keywords": top_terms,
            "size": len(members),
            "cohesion": round(cohesion, 4),
            "blogs": members,
        })

    clusters.sort(key=lambda c: c["size"], reverse=True)

    # Assemble full report
    report = {
        "summary": {
            "total_files_scanned": n_docs,
            "vocabulary_size": len(vectorizer.inv_vocab),
            "lsa_dimensions": int(lsa_full.shape[1]),
            "similar_topic_pairs_count": len(similar_pairs),
            "near_duplicate_pairs_count": len(near_duplicates),
            "near_duplicates_different_titles_count": sum(
                1 for d in near_duplicates if d["different_titles"]
            ),
            "multi_topic_blogs_count": len(multi_topic_blogs),
            "topic_clusters_count": len(clusters),
            "clustering_silhouette_score": round(sil_score, 4),
        },
        "extracted_blogs": [
            {
                "filename": d.filename,
                "url": d.url,
                "title": d.title,
                "meta_title": d.meta_title,
                "description": d.description,
                "category": d.category,
                "tags": d.tags,
                "extracted_keywords": d.extracted_keywords,
                "headings": d.headings,
                "embedded_urls": d.embedded_urls,
                "word_count": d.word_count,
                "section_count": len(d.sections),
            }
            for d in docs
        ],
        "similar_topic_pairs": similar_pairs,
        "near_duplicates": near_duplicates,
        "multi_topic_blogs": multi_topic_blogs,
        "topic_clusters": clusters,
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    json_path = out_dir / "blog_analysis_report.json"
    md_path = out_dir / "blog_analysis_report.md"

    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    md_path.write_text(render_markdown_report(report), encoding="utf-8")
    return report


def render_markdown_report(report: dict[str, Any]) -> str:
    """Render a human-readable Markdown summary of the analysis."""
    s = report["summary"]
    lines = [
        "# Blog Semantic Analysis & Topic Clustering Report",
        "",
        "## Corpus Summary",
        f"- **Total files scanned:** {s['total_files_scanned']}",
        f"- **TF-IDF vocabulary size:** {s['vocabulary_size']}",
        f"- **LSA semantic dimensions:** {s['lsa_dimensions']}",
        f"- **Semantically similar blog pairs (same topic):** {s['similar_topic_pairs_count']}",
        f"- **Near-duplicate pairs:** {s['near_duplicate_pairs_count']} "
        f"({s['near_duplicates_different_titles_count']} with differing titles)",
        f"- **Multi-topic / unfocused blogs:** {s['multi_topic_blogs_count']}",
        f"- **Topic clusters:** {s['topic_clusters_count']} "
        f"(Silhouette score: {s['clustering_silhouette_score']})",
        "",
        "---",
        "",
        "## Near-Duplicate Articles (Including Differing Titles)",
        "",
    ]

    if report["near_duplicates"]:
        for item in report["near_duplicates"]:
            diff_flag = " [DIFFERENT TITLES]" if item["different_titles"] else ""
            lines.append(
                f"- **{item['doc_a']['title']}** (`{item['doc_a']['url']}`) ↔ "
                f"**{item['doc_b']['title']}** (`{item['doc_b']['url']}`){diff_flag}  \n"
                f"  Semantic sim: `{item['semantic_similarity']}` | "
                f"Body TF-IDF sim: `{item['body_tfidf_similarity']}` | "
                f"Title sim: `{item['title_similarity']}`"
            )
    else:
        lines.append("_No near-duplicate pairs detected above threshold._")

    lines.extend(["", "---", "", "## Top Semantically Similar Blog Pairs (Same Topic)", ""])
    for item in report["similar_topic_pairs"][:25]:
        lines.append(
            f"- **{item['doc_a']['title']}** (`{item['doc_a']['filename']}`) ↔ "
            f"**{item['doc_b']['title']}** (`{item['doc_b']['filename']}`) — "
            f"Semantic sim: `{item['semantic_similarity']}`, Title sim: `{item['title_similarity']}`"
        )

    lines.extend(["", "---", "", "## Blogs Covering Multiple Unrelated Topics", ""])
    if report["multi_topic_blogs"]:
        for b in report["multi_topic_blogs"][:25]:
            lines.append(
                f"- **{b['title']}** (`{b['url']}`) — "
                f"{b['section_count']} sections | Mean section sim: `{b['mean_section_similarity']}` | "
                f"Min section sim: `{b['min_section_similarity']}` | "
                f"Divergent sections: _{b['most_divergent_sections'][0]}_ vs _{b['most_divergent_sections'][1]}_"
            )
    else:
        lines.append("_No multi-topic blogs flagged below coherence threshold._")

    lines.extend(["", "---", "", "## Topic Clusters", ""])
    for c in report["topic_clusters"]:
        lines.append(
            f"### Cluster {c['cluster_id']}: {c['label']} ({c['size']} blogs, cohesion `{c['cohesion']}`)"
        )
        lines.append(f"**Keywords:** {', '.join(c['top_keywords'])}")
        for b in c["blogs"]:
            lines.append(
                f"- [{b['title']}]({b['url']}) (`{b['filename']}`, sim `{b['centroid_similarity']}`)"
            )
        lines.append("")

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze blog corpus for semantic similarity, duplicates, and topic clusters.")
    parser.add_argument("--blog-dir", type=Path, default=DEFAULT_BLOG_DIR, help="Path to blog directory")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR, help="Output directory for JSON/MD reports")
    parser.add_argument("--clusters", type=int, default=None, help="Optional fixed number of topic clusters")
    args = parser.parse_args()

    report = analyze_corpus(args.blog_dir, args.out_dir, n_clusters=args.clusters)
    s = report["summary"]

    print("=== BLOG CORPUS ANALYSIS COMPLETE ===")
    print(f"Files scanned:                  {s['total_files_scanned']}")
    print(f"Vocabulary size (1+2-grams):    {s['vocabulary_size']}")
    print(f"Similar topic pairs (>=0.72):   {s['similar_topic_pairs_count']}")
    print(
        f"Near-duplicate pairs:           {s['near_duplicate_pairs_count']} "
        f"({s['near_duplicates_different_titles_count']} with differing titles)"
    )
    print(f"Multi-topic blogs flagged:      {s['multi_topic_blogs_count']}")
    print(
        f"Topic clusters:                 {s['topic_clusters_count']} "
        f"(Silhouette: {s['clustering_silhouette_score']})"
    )
    print(f"Reports saved to:               {args.out_dir}")


if __name__ == "__main__":
    main()
