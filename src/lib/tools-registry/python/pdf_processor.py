"""
Tool: pdf_processor
Category: media
Package: pypdf, pdfplumber, pymupdf
Description: معالجة ملفات PDF — استخراج نص، صور، جدول، دمج، تقسيم.

Dependencies:
  - pypdf (pip install pypdf)
  - pdfplumber (pip install pdfplumber)
  - pymupdf (pip install pymupdf) — for image extraction

Input:
  {
    "pdf_path": "/path/to/file.pdf",
    "operation": "extract_text" | "extract_images" | "extract_tables" | "merge" | "split" | "page_count" | "metadata",
    "output_path": "/path/to/output",
    "pages": "1-5" | "all",
    "merge_files": ["/path/to/file2.pdf"]
  }

Output:
  {
    "success": true,
    "pages": 12,
    "text": "...",
    "tables": [[...]],
    "images": ["/path/to/img1.png"]
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def parse_page_range(pages: str, total: int):
    """Parse '1-5,7,9-11' into list of 0-indexed page numbers."""
    if pages == "all" or not pages:
        return list(range(total))
    result = []
    for part in pages.split(","):
        part = part.strip()
        if "-" in part:
            lo, hi = part.split("-", 1)
            for i in range(int(lo) - 1, int(hi)):
                if 0 <= i < total:
                    result.append(i)
        else:
            i = int(part) - 1
            if 0 <= i < total:
                result.append(i)
    return result


def process(pdf_path: str, operation: str = "extract_text", output_path: str = None, pages: str = "all", merge_files: list = None):
    if not pdf_path or not os.path.exists(pdf_path):
        return {"success": False, "error": f"PDF file not found: {pdf_path}"}

    # Get page count first
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
    except ImportError as e:
        return {"success": False, "error": f"pypdf not installed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"failed to read PDF: {str(e)[:200]}"}

    if operation == "page_count":
        return {"success": True, "pages": total_pages, "file": pdf_path}

    if operation == "metadata":
        meta = reader.metadata
        return {
            "success": True,
            "pages": total_pages,
            "metadata": {
                "title": str(meta.title) if meta and meta.title else "",
                "author": str(meta.author) if meta and meta.author else "",
                "subject": str(meta.subject) if meta and meta.subject else "",
                "creator": str(meta.creator) if meta and meta.creator else "",
                "producer": str(meta.producer) if meta and meta.producer else "",
            },
            "file_size_kb": round(os.path.getsize(pdf_path) / 1024, 2),
        }

    if operation == "extract_text":
        try:
            import pdfplumber
        except ImportError as e:
            return {"success": False, "error": f"pdfplumber not installed: {e}"}

        target_pages = parse_page_range(pages, total_pages)
        all_text = []
        with pdfplumber.open(pdf_path) as pdf:
            for i in target_pages:
                page = pdf.pages[i]
                text = page.extract_text() or ""
                all_text.append({"page": i + 1, "text": text})

        combined = "\n\n".join(f"--- Page {p['page']} ---\n{p['text']}" for p in all_text)
        return {
            "success": True,
            "pages": total_pages,
            "pages_extracted": len(target_pages),
            "text": combined[:10000],  # cap
            "text_length": len(combined),
            "page_texts": [{"page": p["page"], "length": len(p["text"])} for p in all_text],
        }

    if operation == "extract_tables":
        try:
            import pdfplumber
        except ImportError as e:
            return {"success": False, "error": f"pdfplumber not installed: {e}"}

        target_pages = parse_page_range(pages, total_pages)
        all_tables = []
        with pdfplumber.open(pdf_path) as pdf:
            for i in target_pages:
                page = pdf.pages[i]
                tables = page.extract_tables()
                for t_idx, table in enumerate(tables):
                    all_tables.append({
                        "page": i + 1,
                        "table_index": t_idx + 1,
                        "rows": len(table),
                        "cols": len(table[0]) if table else 0,
                        "data": table[:50],  # cap rows
                    })

        return {
            "success": True,
            "pages": total_pages,
            "tables_found": len(all_tables),
            "tables": all_tables,
        }

    if operation == "extract_images":
        try:
            import fitz  # pymupdf
        except ImportError as e:
            return {"success": False, "error": f"pymupdf not installed: {e}"}

        if not output_path:
            output_path = "/tmp/pdf_images"
        os.makedirs(output_path, exist_ok=True)

        doc = fitz.open(pdf_path)
        target_pages = parse_page_range(pages, total_pages)
        extracted = []

        for i in target_pages:
            page = doc[i]
            image_list = page.getImageList()
            for img_idx, img in enumerate(image_list):
                xref = img[0]
                try:
                    base_image = doc.extractImage(xref)
                    image_bytes = base_image["image"]
                    ext = base_image["ext"]
                    fname = os.path.join(output_path, f"page{i + 1}_img{img_idx + 1}.{ext}")
                    with open(fname, "wb") as f:
                        f.write(image_bytes)
                    extracted.append({
                        "page": i + 1,
                        "index": img_idx + 1,
                        "path": fname,
                        "ext": ext,
                        "size_kb": round(len(image_bytes) / 1024, 2),
                    })
                except Exception:
                    continue

        return {
            "success": True,
            "pages": total_pages,
            "images_extracted": len(extracted),
            "images": extracted[:50],
            "output_dir": output_path,
        }

    if operation == "split":
        if not output_path:
            output_path = "/tmp/pdf_split"
        os.makedirs(output_path, exist_ok=True)
        target_pages = parse_page_range(pages, total_pages)
        from pypdf import PdfWriter
        writer = PdfWriter()
        for i in target_pages:
            writer.add_page(reader.pages[i])
        out_file = os.path.join(output_path, f"split_{os.path.basename(pdf_path)}")
        with open(out_file, "wb") as f:
            writer.write(f)
        return {
            "success": True,
            "file": out_file,
            "pages_in_split": len(target_pages),
            "size_kb": round(os.path.getsize(out_file) / 1024, 2),
        }

    if operation == "merge":
        if not merge_files:
            return {"success": False, "error": "merge_files list required for merge operation"}
        if not output_path:
            output_path = "/tmp/merged.pdf"
        from pypdf import PdfWriter
        writer = PdfWriter()
        all_files = [pdf_path] + merge_files
        for f in all_files:
            if not os.path.exists(f):
                continue
            r = PdfReader(f)
            for page in r.pages:
                writer.add_page(page)
        with open(output_path, "wb") as f:
            writer.write(f)
        return {
            "success": True,
            "file": output_path,
            "merged_count": len(all_files),
            "total_pages": len(writer.pages),
            "size_kb": round(os.path.getsize(output_path) / 1024, 2),
        }

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return process(args.get("pdf_path", ""), args.get("operation", "extract_text"), args.get("output_path"), args.get("pages", "all"), args.get("merge_files"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf_path", required=True)
    parser.add_argument("--operation", default="extract_text", choices=["extract_text", "extract_images", "extract_tables", "merge", "split", "page_count", "metadata"])
    parser.add_argument("--output_path", default=None)
    parser.add_argument("--pages", default="all")
    parser.add_argument("--merge_files", nargs="*", default=None)
    args = parser.parse_args()
    result = process(args.pdf_path, args.operation, args.output_path, args.pages, args.merge_files)
    print(json.dumps(result, ensure_ascii=False, default=str))
