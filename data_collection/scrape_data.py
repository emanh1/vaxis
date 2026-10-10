#!/usr/bin/env python3
"""
Scrape drug registration data from dichvucong.dav.gov.vn
Fetches history and ingredients for all drugs in listing.json
"""

import json
import requests
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

# API endpoints
BASE_URL = "https://dichvucong.dav.gov.vn"
HISTORY_URL = f"{BASE_URL}/api/services/app/davSoDangKyHistory/GetHistory"
NGUYEN_LIEU_URL = f"{BASE_URL}/api/services/app/nguyenLieuLamThuoc/GetNguyenLieuTheoSoDangKy"

# Input/Output
LISTING_FILE = "listing.json"
OUTPUT_DIR = "scraped_data"
HISTORY_FILE = f"{OUTPUT_DIR}/history.json"
NGUYEN_LIEU_FILE = f"{OUTPUT_DIR}/nguyen_lieu.json"
PROGRESS_FILE = f"{OUTPUT_DIR}/progress.json"

# Rate limiting
REQUEST_DELAY = 0.5  # seconds between requests

def load_listing():
    """Load the listing.json file"""
    with open(LISTING_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['result']['items']

def load_progress():
    """Load progress to resume from last position"""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'history_done': [], 'nguyen_lieu_done': []}

def save_progress(progress):
    """Save current progress"""
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def get_headers():
    """Return common headers for requests"""
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'Referer': f'{BASE_URL}/',
        'Origin': BASE_URL
    }

def fetch_history(so_dang_ky_id):
    """Fetch history for a registration ID (POST with URL params)"""
    try:
        url = f"{HISTORY_URL}?soDangKyId={so_dang_ky_id}"
        response = requests.post(url, headers=get_headers(), timeout=30)
        response.raise_for_status()
        return {'id': so_dang_ky_id, 'data': response.json(), 'error': None}
    except Exception as e:
        return {'id': so_dang_ky_id, 'data': None, 'error': str(e)}

def fetch_nguyen_lieu(so_dang_ky):
    """Fetch ingredients for a registration number (POST with URL params)"""
    try:
        url = f"{NGUYEN_LIEU_URL}?soDangKy={so_dang_ky}"
        response = requests.post(url, headers=get_headers(), timeout=30)
        response.raise_for_status()
        return {'id': so_dang_ky, 'data': response.json(), 'error': None}
    except Exception as e:
        return {'id': so_dang_ky, 'data': None, 'error': str(e)}

def scrape_all(max_workers=5, delay=0.5):
    """Main scraping function"""
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Load listing and progress
    items = load_listing()
    progress = load_progress()

    print(f"Found {len(items)} drugs in listing.json")
    print(f"Progress: {len(progress['history_done'])} history, {len(progress['nguyen_lieu_done'])} nguyen lieu done")

    # Separate items to process (history uses internal ID, nguyen lieu uses soDangKy)
    history_todo = [(i['soDangKy'], i['id']) for i in items if i['soDangKy'] not in progress['history_done']]
    nguyen_lieu_todo = [i['soDangKy'] for i in items if i['soDangKy'] not in progress['nguyen_lieu_done']]

    print(f"Need to fetch: {len(history_todo)} history, {len(nguyen_lieu_todo)} nguyen lieu")

    # Collect all results
    all_history = []
    all_nguyen_lieu = []

    # Load existing data if any
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            all_history = json.load(f)
    if os.path.exists(NGUYEN_LIEU_FILE):
        with open(NGUYEN_LIEU_FILE, 'r', encoding='utf-8') as f:
            all_nguyen_lieu = json.load(f)

    # Scrape history
    if history_todo:
        print(f"\n--- Fetching History ({len(history_todo)} items) ---")
        for i, (so_dang_ky, internal_id) in enumerate(history_todo, 1):
            result = fetch_history(internal_id)  # Use internal ID for history API
            if result['data']:
                all_history.append(result['data'])
            if result['error']:
                print(f"  [{i}/{len(history_todo)}] Error {so_dang_ky}: {result['error']}")
            else:
                print(f"  [{i}/{len(history_todo)}] ✓ {so_dang_ky}")

            progress['history_done'].append(so_dang_ky)
            save_progress(progress)

            # Save periodically
            if i % 10 == 0:
                with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
                    json.dump(all_history, f, ensure_ascii=False, indent=2)

            time.sleep(delay)

    # Save history
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_history, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(all_history)} history records to {HISTORY_FILE}")

    # Scrape Nguyen Lieu
    if nguyen_lieu_todo:
        print(f"\n--- Fetching Nguyen Lieu ({len(nguyen_lieu_todo)} items) ---")
        for i, so_dang_ky in enumerate(nguyen_lieu_todo, 1):
            result = fetch_nguyen_lieu(so_dang_ky)
            if result['data']:
                all_nguyen_lieu.append(result['data'])
            if result['error']:
                print(f"  [{i}/{len(nguyen_lieu_todo)}] Error {so_dang_ky}: {result['error']}")
            else:
                print(f"  [{i}/{len(nguyen_lieu_todo)}] ✓ {so_dang_ky}")

            progress['nguyen_lieu_done'].append(so_dang_ky)
            save_progress(progress)

            # Save periodically
            if i % 10 == 0:
                with open(NGUYEN_LIEU_FILE, 'w', encoding='utf-8') as f:
                    json.dump(all_nguyen_lieu, f, ensure_ascii=False, indent=2)

            time.sleep(delay)

    # Save Nguyen Lieu
    with open(NGUYEN_LIEU_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_nguyen_lieu, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(all_nguyen_lieu)} nguyen lieu records to {NGUYEN_LIEU_FILE}")

    # Clean up progress file when done
    if len(progress['history_done']) >= len(items):
        os.remove(PROGRESS_FILE)
        print("\n✅ All scraping complete! Progress file removed.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Scrape drug registration data')
    parser.add_argument('--workers', '-w', type=int, default=3, help='Number of concurrent workers')
    parser.add_argument('--delay', '-d', type=float, default=0.5, help='Delay between requests (seconds)')
    args = parser.parse_args()

    scrape_all(max_workers=args.workers, delay=args.delay)
