---
description: Quy trình Refactor chuẩn cho UI Component bị phình to (Blueprint)
---

Khi một React Component (.tsx) trở nên quá phức tạp (dài > 150 dòng, > 3 hooks, hoặc logic xử lý nặng), hãy áp dụng cấu trúc thư mục sau:

### Cấu trúc thư mục
```text
[ComponentName]/
├── index.tsx           # UI Entry point (chỉ chứa render và gọi hook)
├── use[ComponentName].ts # Logic & State (Internal Custom Hook)
├── types.ts            # Interfaces, Types và Constants nội bộ
└── components/         # (Tùy chọn) Các sub-components nhỏ nếu cần
```

### Các bước thực hiện:

1.  **Bước 1: Khởi tạo thư mục**
    - Tạo folder trùng tên với component tại vị trí cũ.

2.  **Bước 2: Tách Types**
    - Di chuyển tất cả interface, enum, và type liên quan trực tiếp đến component vào file `types.ts`.

3.  **Bước 3: Tách Logic (Custom Hook)**
    - Chuyển `useState`, `useEffect`, `useMemo`, `useCallback` và các hàm xử lý (handle functions) vào file `use[ComponentName].ts`.
    - Hook này sẽ trả về state và các hàm cần thiết cho UI.

4.  ** Bước 4: Tinh gọn Index**
    - File `index.tsx` chỉ giữ lại phần JSX.
    - Gọi custom hook vừa tạo để lấy các biến/hàm.
    - Đảm bảo file này sạch sẽ và tập trung vào trình bày UI (Presentational).
