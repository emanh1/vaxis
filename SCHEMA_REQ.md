Dưới đây là bảng schema cho Golden Evaluation Dataset của hệ thống Vaccine RAG, gồm hai cột `schema` và `expected_values`. Các giá trị được đề xuất theo hướng chuẩn hóa để thuận tiện cho việc tạo dataset, annotation và đánh giá retrieval.

| schema                                     | expected_values                                                                                                                                                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QUERY_ID`                                 | Chuỗi định danh duy nhất, ví dụ: `VAX_Q_001`                                                                                                                                                                               |
| `QUERY`                                    | Chuỗi văn bản câu hỏi bằng tiếng Việt                                                                                                                                                                                      |
| `QUERY_DIFFICULTY`                         | `EASY`, `MEDIUM`, `HARD`                                                                                                                                                                                                   |
| `QUERY_TYPE`                               | `INDICATION`, `DOSAGE`, `SCHEDULE`, `AGE`, `CONTRAINDICATION`, `PRECAUTION`, `ADVERSE_EFFECT`, `ADMINISTRATION_ROUTE`, `STORAGE`, `SPECIAL_POPULATION`, `INTERACTION`, `COMPOSITION`, `MISSED_DOSE`, `COMPARISON`, `OTHER` |
| `QUERY_SOURCE`                             | `TEMPLATE`, `PARAPHRASE`, `CLINICAL_SCENARIO`, `REAL_USER_QUERY`, `OTHER`                                                                                                                                                  |
| `QUERY_COMPLEXITY`                         | `SINGLE_HOP`, `MULTI_HOP`                                                                                                                                                                                                  |
| `ENTITIES`                                 | Object chứa các thực thể trong câu hỏi, ví dụ: `{"vaccine": "Vaccine X", "age": 65}`                                                                                                                                       |
| `CONSTRAINTS`                              | Object chứa các điều kiện hoặc ràng buộc; `{}` nếu không có, ví dụ: `{"age": ">=65", "previous_doses": 0}`                                                                                                                 |
| `ANSWERABILITY`                            | `ANSWERABLE`, `PARTIALLY_ANSWERABLE`, `UNANSWERABLE`, `INSUFFICIENT_EVIDENCE`                                                                                                                                              |
| `RELEVANT_DOCS`                            | Danh sách ID tài liệu liên quan, ví dụ: `["DOC_001", "DOC_002"]`                                                                                                                                                           |
| `RELEVANT_CHUNKS`                          | Danh sách object chứa thông tin chunk liên quan, nội dung và nhãn relevance                                                                                                                                                |
| `RELEVANT_CHUNKS[].CHUNK_ID`               | ID chunk duy nhất, ví dụ: `CH_001`                                                                                                                                                                                         |
| `RELEVANT_CHUNKS[].TEXT`                   | Nội dung nguyên văn của chunk                                                                                                                                                                                              |
| `RELEVANT_CHUNKS[].RELEVANCE_SCORE`        | Số nguyên `0`, `1`, `2`, `3`                                                                                                                                                                                               |
| `RELEVANT_CHUNKS[].EVIDENCE_SPANS`         | Danh sách đoạn bằng chứng trong chunk, mỗi phần tử gồm `START` và `END`                                                                                                                                                    |
| `RELEVANT_CHUNKS[].EVIDENCE_SPANS[].START` | Vị trí ký tự bắt đầu, số nguyên không âm                                                                                                                                                                                   |
| `RELEVANT_CHUNKS[].EVIDENCE_SPANS[].END`   | Vị trí ký tự kết thúc, số nguyên lớn hơn `START`                                                                                                                                                                           |
| `REQUIRED_EVIDENCE_GROUPS`                 | Danh sách nhóm thông tin cần truy xuất, ví dụ: `NUMBER_OF_DOSES`, `DOSING_INTERVAL`, `MINIMUM_AGE`, `CONTRAINDICATIONS`, `INDICATIONS`, `ADVERSE_EFFECTS`; có thể chứa nhiều nhóm                                          |
| `EVIDENCE_COMPLETENESS`                    | `COMPLETE`, `PARTIAL`, `NOT_ASSESSED`                                                                                                                                                                                      |
| `REFERENCE_ANSWER`                         | Chuỗi câu trả lời chuẩn đã được xác minh; `null` nếu không đánh giá đáp án sinh                                                                                                                                            |
| `CLAIM_EVIDENCE_MAP`                       | Danh sách ánh xạ giữa từng claim và bằng chứng hỗ trợ; `[]` nếu không sử dụng đánh giá claim-level                                                                                                                         |
| `SOURCE_VERSION`                           | ID hoặc mã phiên bản tài liệu nguồn, ví dụ: `PI_VERSION_ID`                                                                                                                                                                |
| `VERIFIED`                                 | Boolean: `true`, `false`                                                                                                                                                                                                   |
| `ANNOTATOR_IDS`                            | Danh sách ID người gán nhãn, ví dụ: `["A1", "A2"]`                                                                                                                                                                         |
| `ADJUDICATED`                              | Boolean: `true`, `false`                                                                                                                                                                                                   |
| `VERIFICATION_NOTES`                       | Chuỗi ghi chú hoặc `null` nếu không có                                                                                                                                                                                     |

## Quy ước quan trọng để tránh sai lệch khi đánh giá

1\. Chuẩn hóa `RELEVANCE_SCORE`

| Score | Ý nghĩa                                                             |
| ----- | ------------------------------------------------------------------- |
| `0`   | Không liên quan đến câu hỏi                                         |
| `1`   | Có liên quan nhẹ nhưng không cung cấp bằng chứng hữu ích để trả lời |
| `2`   | Có thông tin hữu ích, hỗ trợ trả lời một phần hoặc gián tiếp        |
| `3`   | Bằng chứng trực tiếp, đầy đủ và phù hợp để trả lời câu hỏi          |

2\. Quy ước `EVIDENCE_SPANS`

Nên thống nhất vị trí ký tự theo quy ước khoảng nửa mở `[START, END)`: `START` được tính, `END` không được tính. Offset được tính trên chính trường `TEXT` của chunk, không phải trên toàn bộ tài liệu. Nếu chunk được chỉnh sửa, cần tính lại offset.

3\. Phân biệt trạng thái bằng chứng

- `COMPLETE`: đã rà soát đủ bằng chứng liên quan và xác định được các nhóm bằng chứng cần thiết.
- `PARTIAL`: đã tìm được một phần bằng chứng nhưng còn thiếu ít nhất một nhóm cần thiết.
- `NOT_ASSESSED`: chưa đánh giá tính đầy đủ.

`UNANSWERABLE` chỉ nên dùng khi xác định câu hỏi không thể trả lời từ phạm vi nguồn được quy định; `INSUFFICIENT_EVIDENCE` dùng khi bằng chứng hiện có không đủ để xác lập câu trả lời. Hai trạng thái này không nên bị đánh đồng.

4\. Phân biệt `VERIFIED` và `ADJUDICATED`

- `VERIFIED`: bản ghi đã được kiểm tra theo quy trình xác minh.
- `ADJUDICATED`: có bất đồng giữa các annotator và đã được người có trách nhiệm phân xử.

Vì vậy, `VERIFIED = true` không bắt buộc đồng nghĩa với `ADJUDICATED = true`.

Lưu ý thiết kế: Với `RELEVANT_CHUNKS`, nên lưu `CHUNK_ID` và `RELEVANCE_SCORE` làm ground truth cốt lõi. Trường `TEXT` có thể được lưu trực tiếp để thuận tiện kiểm tra thủ công, nhưng cần đảm bảo nội dung này đồng bộ với chunk trong kho dữ liệu. Đối với benchmark retrieval, `REFERENCE_ANSWER` và `CLAIM_EVIDENCE_MAP` là tùy chọn; chúng hữu ích hơn khi đánh giá thêm chất lượng sinh câu trả lời của RAG.