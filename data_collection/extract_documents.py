#!/usr/bin/env python3
"""
Extract document URLs (labels, usage instructions, etc.) from listing.json
These are the documents accessed via ng-click="vm.viewMauNhanVaHDSD(this.dataItem)"
"""

import json
import os
import urllib.parse

BASE_URL = "https://dichvucong.dav.gov.vn"
FILE_VIEW_URL = f"{BASE_URL}/File/GoToViewTaiLieu?url="

def extract_documents():
    """Extract all document URLs from listing.json"""
    with open('listing.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    documents = []
    errors = []

    for item in data['result']['items']:
        so_dang_ky = item.get('soDangKy', '')
        ten_thuoc = item.get('tenThuoc', '')
        thong_tin_tai_lieu = item.get('thongTinTaiLieu', {})

        item_docs = {
            'soDangKy': so_dang_ky,
            'tenThuoc': ten_thuoc,
            'documents': []
        }

        # Process each document type
        doc_types = {
            'urlHuongDanSuDung': 'HDSD',  # Usage instructions
            'urlNhan': 'Nhan',              # Label
            'urlNhanVaHDSD': 'NhanVaHDSD',  # Label + Usage
            'jsonTaiLieuTCCL': 'TCCL'      # Other documents
        }

        for field, doc_type in doc_types.items():
            docs_json = thong_tin_tai_lieu.get(field)
            if not docs_json:
                continue

            try:
                if not docs_json or (isinstance(docs_json, str) and not docs_json.strip()):
                    continue

                # Check if it's a JSON array or a plain string (file path)
                if isinstance(docs_json, str):
                    # Try to parse as JSON first
                    try:
                        docs_list = json.loads(docs_json)
                    except json.JSONDecodeError:
                        # It's a plain string - treat as file path directly
                        docs_list = [{'duongDanTep': docs_json, 'moTaTep': doc_type, 'jsonTepDinhKem': None}]
                else:
                    docs_list = docs_json

                if not isinstance(docs_list, list):
                    docs_list = [docs_list]

                for doc in docs_list:
                    if not isinstance(doc, dict):
                        continue

                    path = doc.get('duongDanTep')
                    if not path:
                        continue

                    mo_ta = doc.get('moTaTep', doc_type)
                    is_cong_bo = doc.get('isCongBoMauNhan', False)
                    is_cong_bo_hd = doc.get('isCongBoHd', False)
                    json_tep = doc.get('jsonTepDinhKem')

                    # Build full URL
                    full_url = f"{FILE_VIEW_URL}{urllib.parse.quote(path)}"

                    doc_entry = {
                        'type': doc_type,
                        'description': mo_ta,
                        'path': path,
                        'url': full_url,
                        'isCongBoMauNhan': is_cong_bo,
                        'isCongBoHd': is_cong_bo_hd,
                        'hasAttachment': bool(json_tep)
                    }

                    item_docs['documents'].append(doc_entry)
                    documents.append({
                        'soDangKy': so_dang_ky,
                        'tenThuoc': ten_thuoc,
                        **doc_entry
                    })

            except json.JSONDecodeError as e:
                errors.append({
                    'soDangKy': so_dang_ky,
                    'field': field,
                    'error': str(e)
                })

        # Save item-level docs too
        os.makedirs('scraped_data', exist_ok=True)
        item_docs['totalDocs'] = len(item_docs['documents'])
        item_docs['hasDocuments'] = item_docs['totalDocs'] > 0

    # Save all documents to file
    os.makedirs('scraped_data', exist_ok=True)

    with open('scraped_data/documents.json', 'w', encoding='utf-8') as f:
        json.dump(documents, f, ensure_ascii=False, indent=2)

    # Save summary per drug
    summary = [{
        'soDangKy': item.get('soDangKy'),
        'tenThuoc': item.get('tenThuoc'),
        'totalDocs': sum(1 for doc in documents if doc['soDangKy'] == item.get('soDangKy'))
    } for item in data['result']['items']]

    with open('scraped_data/documents_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"✅ Extracted {len(documents)} document URLs")
    print(f"   Documents per type:")
    type_counts = {}
    for doc in documents:
        type_counts[doc['type']] = type_counts.get(doc['type'], 0) + 1
    for doc_type, count in sorted(type_counts.items()):
        print(f"     {doc_type}: {count}")
    print(f"\nSaved to scraped_data/documents.json")
    print(f"Saved summary to scraped_data/documents_summary.json")

    if errors:
        print(f"\n⚠️ {len(errors)} items had parsing errors")
        with open('scraped_data/document_errors.json', 'w', encoding='utf-8') as f:
            json.dump(errors, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    extract_documents()
