#!/usr/bin/env python3
"""
Download documents (PDFs) from the extracted URLs
"""

import json
import os
import requests
import time
from pathlib import Path
from urllib.parse import unquote

# Settings
DOCUMENTS_FILE = "scraped_data/documents.json"
OUTPUT_DIR = "scraped_data/documents"
DELAY = 0.5  # seconds between requests

def get_headers():
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://dichvucong.dav.gov.vn/'
    }

def download_documents(max_retries=3, delay=DELAY):
    """Download all documents from scraped URLs"""

    # Load documents
    with open(DOCUMENTS_FILE, 'r', encoding='utf-8') as f:
        documents = json.load(f)

    print(f"Found {len(documents)} documents to download")

    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Load progress
    progress_file = f"{OUTPUT_DIR}/../download_progress.json"
    if os.path.exists(progress_file):
        with open(progress_file, 'r', encoding='utf-8') as f:
            downloaded = set(json.load(f))
    else:
        downloaded = set()

    print(f"Already downloaded: {len(downloaded)}")

    success = 0
    failed = []
    skipped = 0

    for i, doc in enumerate(documents, 1):
        doc_id = doc['url']

        if doc_id in downloaded:
            skipped += 1
            continue

        so_dang_ky = doc['soDangKy']
        doc_type = doc['type']
        url = doc['url']
        filename = doc['path'].split('\\')[-1]  # Get filename from path
        filename = unquote(filename)  # Decode URL encoding

        # Create folder for this drug
        drug_dir = os.path.join(OUTPUT_DIR, so_dang_ky)
        os.makedirs(drug_dir, exist_ok=True)

        # Save file
        filepath = os.path.join(drug_dir, filename)

        for attempt in range(max_retries):
            try:
                response = requests.get(url, headers=get_headers(), timeout=30, allow_redirects=True)

                if response.status_code == 200:
                    # Check content type
                    content_type = response.headers.get('Content-Type', '')
                    if 'html' in content_type.lower() and len(response.content) < 1000:
                        # Probably got an error page
                        raise Exception(f"Got HTML instead of PDF (status {response.status_code})")

                    with open(filepath, 'wb') as f:
                        f.write(response.content)

                    print(f"  [{i}/{len(documents)}] ✓ {so_dang_ky}/{filename}")
                    success += 1
                    downloaded.add(doc_id)
                    break
                else:
                    raise Exception(f"HTTP {response.status_code}")

            except Exception as e:
                if attempt == max_retries - 1:
                    print(f"  [{i}/{len(documents)}] ✗ {so_dang_ky}/{filename}: {e}")
                    failed.append({
                        'doc': doc,
                        'error': str(e)
                    })
                else:
                    time.sleep(1)

        # Save progress periodically
        if i % 10 == 0:
            with open(progress_file, 'w', encoding='utf-8') as f:
                json.dump(list(downloaded), f)

        time.sleep(delay)

    # Final save
    with open(progress_file, 'w', encoding='utf-8') as f:
        json.dump(list(downloaded), f)

    print(f"\n✅ Download complete!")
    print(f"   Downloaded: {success}")
    print(f"   Skipped: {skipped}")
    print(f"   Failed: {len(failed)}")

    if failed:
        with open(f"{OUTPUT_DIR}/../download_errors.json", 'w', encoding='utf-8') as f:
            json.dump(failed, f, ensure_ascii=False, indent=2)
        print(f"   Errors saved to download_errors.json")

    # Summary
    print(f"\n📁 Documents saved to: {OUTPUT_DIR}/")
    total_files = sum(len(files) for _, _, files in os.walk(OUTPUT_DIR))
    print(f"   Total files: {total_files}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Download documents')
    parser.add_argument('--delay', '-d', type=float, default=0.5, help='Delay between requests')
    parser.add_argument('--retry', '-r', type=int, default=3, help='Max retries')
    args = parser.parse_args()

    download_documents(max_retries=args.retry, delay=args.delay)
