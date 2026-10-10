#!/usr/bin/env python3
"""
Generate test dataset from vaccine markdown documents.

Reads all .md files from data/ folder and generates question-answer pairs
in the specified JSON format.
"""

import json
import os
import re
import uuid
from pathlib import Path
from typing import Optional


# Question templates per category
QUESTION_TEMPLATES = {
    "indications": [
        "Vắc xin {name} được sử dụng để phòng bệnh gì?",
        "{name} phòng ngừa những bệnh nào?",
        "Vaccine {name} có chỉ định cho những bệnh lý gì?",
    ],
    "target_population": [
        "Vắc xin {name} dành cho những đối tượng nào?",
        "Những ai có thể tiêm vaccine {name}?",
        "Đối tượng nào được tiêm {name}?",
    ],
    "dosage": [
        "Vắc xin {name} cần tiêm bao nhiêu liều, mỗi liều cách nhau bao lâu?",
        "Lịch tiêm chủng của vaccine {name} như thế nào?",
        "Tôi cần tiêm bao nhiêu liều {name} và khoảng cách giữa các liều là bao lâu?",
    ],
    "contraindications": [
        "Những trường hợp nào chống chỉ định sử dụng vaccine {name}?",
        "Ai không nên tiêm {name}?",
        "Khi nào thì không nên tiêm vaccine {name}?",
    ],
    "pregnancy": [
        "Tôi đang mang thai thì tôi có thể sử dụng vaccine {name} không?",
        "Phụ nữ đang mang thai có tiêm được {name} không?",
        "Vắc xin {name} có ảnh hưởng gì đến thai kỳ không?",
    ],
    "breastfeeding": [
        "Phụ nữ đang cho con bú có thể tiêm vaccine {name} không?",
        "Mẹ đang cho con bú có tiêm được {name} không?",
    ],
    "side_effects_common": [
        "Sau khi tiêm vaccine {name}, những phản ứng phụ thường gặp là gì?",
        "Tôi tiêm {name} xong thường gặp những tác dụng phụ nào?",
        "Những phản ứng phụ nào có thể xuất hiện sau khi tiêm {name}?",
    ],
    "side_effects_specific": [
        "Sau khi tiêm vaccine {name}, tôi thấy tôi bị đau đầu và mệt, có phải phản ứng phụ của nó không?",
        "Tôi bị sưng ở chỗ tiêm vaccine sau khi tiêm {name}, có bình thường không?",
        "Tôi đã tiêm vaccine {name} được 2 ngày rồi nhưng vẫn còn sốt nhẹ. Trường hợp này có bình thường không?",
    ],
    "side_effects_serious": [
        "Những phản ứng phụ nghiêm trọng nào có thể xảy ra sau khi tiêm vaccine {name}?",
        "Tác dụng phụ nguy hiểm nào có thể xảy ra khi tiêm {name}?",
    ],
    "allergy_history": [
        "Nếu trước đây tôi từng bị dị ứng sau khi tiêm một loại vaccine khác thì có tiêm được vaccine {name} không?",
        "Tôi có tiền sử dị ứng vaccine, có tiêm được {name} không?",
    ],
    "concurrent_vaccines": [
        "Vaccine {name} có thể tiêm cùng lúc với các vaccine khác không?",
        "Tôi có thể tiêm {name} đồng thời với vaccine cúm được không?",
        "Những vaccine nào có thể tiêm cùng lúc với {name}?",
    ],
    "underlying_conditions": [
        "Tôi bị bệnh nền, vậy tôi có thuộc nhóm cần thận trọng khi tiêm vaccine {name} không?",
        "Người có bệnh lý nền có tiêm được {name} không?",
        "Những bệnh nền nào cần thận trọng khi tiêm {name}?",
    ],
    "missed_dose": [
        "Nếu tôi bỏ lỡ lịch tiêm mũi tiếp theo của vaccine {name}, tôi có cần tiêm lại từ đầu không?",
        "Tôi quên tiêm liều nhắc của {name}, phải làm sao?",
    ],
    "post_vaccination_monitoring": [
        "Sau khi tiêm vaccine {name}, tôi nên theo dõi những triệu chứng gì và trong bao lâu?",
        "Sau khi tiêm {name} tôi cần chú ý điều gì?",
    ],
    "injection_site_reaction": [
        "Tôi vừa tiêm vaccine {name} và thấy chỗ tiêm đỏ, nóng và đau. Những triệu chứng này kéo dài bao lâu thì được xem là bất thường?",
        "Chỗ tiêm {name} bị sưng đỏ có bình thường không?",
    ],
    "age_specific": [
        "Trẻ em và người lớn có sử dụng cùng lịch tiêm vaccine {name} không?",
        "Vắc xin {name} có khác gì khi tiêm cho trẻ em và người lớn không?",
    ],
    "unknown_vaccination_history": [
        "Tôi không nhớ mình đã từng tiêm vaccine {name} hay chưa. Có cần tiêm lại không?",
        "Không biết đã tiêm {name} chưa thì có tiêm được không?",
    ],
    "storage": [
        "Vắc xin {name} cần được bảo quản như thế nào?",
        "Điều kiện bảo quản vaccine {name} là gì?",
        "Vắc xin {name} có cần bảo quản lạnh không?",
    ],
    "driving_operating": [
        "Sau khi tiêm vaccine {name}, tôi có thể lái xe hoặc vận hành máy móc không?",
    ],
}

# Map sections to expected_documents and expected_sections
SECTION_MAPPING = {
    "indications": ["CHỈ ĐỊNH"],
    "target_population": ["CHỈ ĐỊNH", "Đối tượng sử dụng"],
    "dosage": ["LIỀU LƯỢNG VÀ CÁCH DÙNG"],
    "contraindications": ["CHỐNG CHỈ ĐỊNH"],
    "pregnancy": ["THAI KỲ VÀ CHO CON BÚ"],
    "breastfeeding": ["THAI KỲ VÀ CHO CON BÚ"],
    "side_effects_common": ["TÁC DỤNG KHÔNG MONG MUỐN"],
    "side_effects_specific": ["TÁC DỤNG KHÔNG MONG MUỐN"],
    "side_effects_serious": ["TÁC DỤNG KHÔNG MONG MUỐN"],
    "allergy_history": ["CHỐNG CHỈ ĐỊNH", "CẢNH BÁO VÀ THẬN TRỌNG"],
    "concurrent_vaccines": ["TƯƠNG TÁC VÀ TƯƠNG KỴ"],
    "underlying_conditions": ["CẢNH BÁO VÀ THẬN TRỌNG"],
    "missed_dose": ["LIỀU LƯỢNG VÀ CÁCH DÙNG"],
    "post_vaccination_monitoring": ["CẢNH BÁO VÀ THẬN TRỌNG"],
    "injection_site_reaction": ["TÁC DỤNG KHÔNG MONG MUỐN"],
    "age_specific": ["LIỀU LƯỢNG VÀ CÁCH DÙNG"],
    "unknown_vaccination_history": ["LIỀU LƯỢNG VÀ CÁCH DÙNG"],
    "storage": ["THÔNG TIN SẢN PHẨM", "BẢO QUẢN"],
    "driving_operating": ["ẢNH HƯỞNG ĐẾN KHẢ NĂNG LÁI XE VÀ VẬN HÀNH MÁY MÓC"],
}

# Categories that require clarification (when vaccine name is unknown)
REQUIRES_CLARIFICATION_CATEGORIES = ["unknown_vaccination_history"]

# Difficulty distribution
DIFFICULTY_LEVELS = ["easy", "medium", "hard"]


# Load vaccine name mapping from metadata
VACCINE_MAPPING = {}
_mapping_path = Path(__file__).parent / "vaccine_name_mapping.json"
if _mapping_path.exists():
    with open(_mapping_path, 'r', encoding='utf-8') as f:
        VACCINE_MAPPING = json.load(f)


def extract_vaccine_name(filepath: Path, content: str = None) -> str:
    """Extract vaccine name using metadata mapping or content analysis."""

    # Primary: Use folder name from metadata mapping
    folder_name = filepath.parent.name
    if folder_name in VACCINE_MAPPING:
        return VACCINE_MAPPING[folder_name]

    # Fallback: Try content analysis
    if content:
        # Comprehensive list of vaccine names (Vietnamese market)
        common_names = [
            "Arexvy", "Shingrix", "Rotarix", "Rotavin", "Rotavac",
            "Cervarix", "Gardasil", "Gardasil9", "Silgard",
            "Menactra", "Nimenrix", "Bexsero", "Trumenba", "MenQuadfi",
            "Prevenar", "Synflorix", "Vaxneuvance", "Prevenar 20",
            "Varivax", "Varilrix", "Zostavax", "Skyvaricella",
            "Fluad", "Fluzone", "Influvac", "Vaxigrip", "Cervavac", "Flumist",
            "Adacel", "Boostrix", "Pentaxim", "Infanrix", "Infanrix-IPV",
            "Infanrix hexa", "M-M-R II", "MMR", "Priorix", "M-M-RvaxPro",
            "Havrix", "Engerix", "Twinrix", "Heberbiovac",
            "Truxta", "Euvax", "Hepavax", "Envacgen",
            "Comirnaty", "Spikevax", "Vaxzevria", "Jcovden", "Convidecia",
            "Covaxin", "Sinovac", "Coronavac", "Sinopharm", "Sputnik",
            "Imojev", "Jeev", "Qdenga", "Stamaril",
            "Abrysvo", "Beyfortus", "Nirsevimab", "Barycela",
            "Grafeel", "Neulasta", "Peggrafeel", "ProQuad",
        ]

        content_upper = content.upper()
        for name in common_names:
            if name.upper() in content_upper:
                return name

    # Final fallback: Use filename
    return filepath.stem


def generate_filename(filepath: Path, vaccine_name: str) -> str:
    """Generate expected filename - use actual folder/file name."""
    # Return the actual filename (folder name)
    return filepath.name


def determine_difficulty(category: str) -> str:
    """Determine question difficulty based on category."""
    # Simple questions
    if category in ["indications", "target_population", "storage"]:
        return "easy"
    # Medium difficulty
    elif category in ["dosage", "side_effects_common", "concurrent_vaccines",
                     "post_vaccination_monitoring", "age_specific"]:
        return "medium"
    # Harder questions requiring more context
    else:
        return "hard"


def generate_question_entry(vaccine_name: str, category: str,
                           question_template: str,
                           filepath: Path) -> dict:
    """Generate a single question entry."""
    entry = {
        "id": f"{category}-{uuid.uuid4().hex[:8]}",
        "question": question_template.format(name=vaccine_name),
        "category": category,
        "difficulty": determine_difficulty(category),
        "expected_documents": [filepath.name],
        "expected_sections": SECTION_MAPPING.get(category, []),
        "answer_type": "grounded",
        "requires_clarification": category in REQUIRES_CLARIFICATION_CATEGORIES
    }

    return entry


def process_document(filepath: Path) -> list[dict]:
    """Process a single document and generate questions."""
    try:
        content = filepath.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        try:
            content = filepath.read_text(encoding='latin-1')
        except Exception:
            return []

    vaccine_name = extract_vaccine_name(filepath, content)

    questions = []

    for category, templates in QUESTION_TEMPLATES.items():
        # Pick one template per category (could randomize for more variety)
        template = templates[0]  # Use first template for consistency

        entry = generate_question_entry(
            vaccine_name=vaccine_name,
            category=category,
            question_template=template,
            filepath=filepath
        )
        questions.append(entry)

    return questions


def main():
    """Main function to generate test dataset."""
    data_dir = Path("data")
    output_file = Path("test_dataset.json")

    all_questions = []
    processed_files = 0

    # Process all markdown files
    for filepath in data_dir.rglob("*.md"):
        questions = process_document(filepath)
        all_questions.extend(questions)
        processed_files += 1

    # Create output
    dataset = {
        "metadata": {
            "description": "Vaccine Q&A test dataset for RAG evaluation",
            "source": "Vietnamese vaccine documentation",
            "total_documents": processed_files,
            "total_questions": len(all_questions),
            "categories": list(QUESTION_TEMPLATES.keys()),
        },
        "questions": all_questions
    }

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    print(f"✅ Generated {len(all_questions)} questions from {processed_files} documents")
    print(f"📁 Output saved to: {output_file}")
    print(f"\n📊 Category breakdown:")
    for category in QUESTION_TEMPLATES.keys():
        count = sum(1 for q in all_questions if q['category'] == category)
        print(f"   - {category}: {count} questions")


if __name__ == "__main__":
    main()
