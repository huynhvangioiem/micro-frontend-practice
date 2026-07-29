# Micro-Frontend Demo — Outline (2h30)

Stack: **Rsbuild + Module Federation 2.0** (`@module-federation/rsbuild-plugin`), React 19.

## Cấu trúc đích

```
micro-frontend-practice/
  host/          # shell app: layout + routing, load 2 remote        :3000
  remote-cart/   # expose 1 component                                :3010
  remote-user/   # expose 1 component + 1 custom hook                :3002
```

Hiện có `mf-practice-provider` (:3010) và `mf-practice-consumer` (chưa set port).
→ Đổi tên: `consumer` = **host**, `provider` = **remote-cart**, tạo mới **remote-user**.

## Mục tiêu tối thiểu (checklist)

- [ ] Host load được 2 remote qua dynamic import
- [ ] Share `react` + `react-dom` ở chế độ `singleton`
- [ ] `remote-user` expose cả component lẫn custom hook
- [ ] **Cố tình phá**: đổi version React ở 1 remote → thấy lỗi thật → sửa

---

## Bước 0 — Dọn nền (15')

1. Đổi tên thư mục: `mf-practice-consumer` → `host`, `mf-practice-provider` → `remote-cart`.
   Sửa `name` trong `package.json` + `module-federation.config.ts` cho khớp.
2. `host/rsbuild.config.ts`: thêm `server: { port: 3000 }`.
3. `remote-cart`: giữ `port: 3010`.
4. Cài deps ở cả 2: `pnpm install` (hoặc npm).
5. Chạy thử `pnpm dev` từng app, xác nhận trang trắng vẫn render.

> Lưu ý: `host/module-federation.config.ts` hiện trỏ remote tới một package trên unpkg
> (`rslib_provider@https://unpkg.com/...`). Đây là remote mẫu — sẽ thay bằng remote local.

## Bước 1 — remote-cart: expose 1 component (20')

1. `src/components/CartWidget.tsx`: component có state riêng (số item trong giỏ,
   nút +/-). Có state để sau này chứng minh singleton React thật sự hoạt động.
2. `module-federation.config.ts`:
   ```ts
   name: 'remote_cart',
   filename: 'remoteEntry.js',
   exposes: { './CartWidget': './src/components/CartWidget.tsx' },
   shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
   ```
   - Đổi key expose từ `'.'` sang `'./CartWidget'` cho rõ nghĩa.
   - `name` dùng snake_case (là tên biến global) — tránh dấu `-`.
3. Kiểm tra: mở `http://localhost:3010/mf-manifest.json` thấy `CartWidget` trong `exposes`.

## Bước 2 — remote-user: expose component + hook (25')

1. Scaffold app thứ 3, port `3002`. Cách nhanh: copy `remote-cart`, đổi `name` +
   `port`, xoá component cũ.
2. `src/hooks/useCurrentUser.ts` — custom hook trả `{ user, loading, refresh }`,
   dùng `useState`/`useEffect` (mock async 500ms).
3. `src/components/UserBadge.tsx` — component dùng chính hook đó.
4. Expose cả hai:
   ```ts
   exposes: {
     './UserBadge': './src/components/UserBadge.tsx',
     './useCurrentUser': './src/hooks/useCurrentUser.ts',
   },
   ```
5. **Điểm cần hiểu**: expose hook chỉ hoạt động khi React là singleton. Nếu host và
   remote có 2 bản React khác nhau → hook chạy trên React instance khác → lỗi
   "Invalid hook call". Đây là setup cho Bước 4.

## Bước 3 — Host: routing + dynamic import 2 remote (35')

1. Cài `react-router-dom` ở host.
2. `module-federation.config.ts` của host:
   ```ts
   remotes: {
     remote_cart: 'remote_cart@http://localhost:3010/mf-manifest.json',
     remote_user: 'remote_user@http://localhost:3002/mf-manifest.json',
   },
   shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
   ```
3. `src/env.d.ts`: khai báo module cho TS:
   ```ts
   declare module 'remote_cart/CartWidget';
   declare module 'remote_user/UserBadge';
   declare module 'remote_user/useCurrentUser';
   ```
4. Layout: sidebar + `<Outlet />`. Routes:
   - `/` → trang home tĩnh
   - `/cart` → `React.lazy(() => import('remote_cart/CartWidget'))`
   - `/user` → `React.lazy(() => import('remote_user/UserBadge'))`
5. Bọc `<Suspense fallback>` + một `ErrorBoundary` (bắt buộc — remote chết thì
   host không được sập theo).
6. Thêm 1 chỗ host **gọi trực tiếp hook của remote** để chứng minh hook chạy được
   xuyên biên giới:
   ```tsx
   const { user } = useCurrentUser(); // import từ remote_user
   ```
7. Chạy 3 app cùng lúc, xác nhận cả 2 route render.

## Bước 4 — Cố tình phá: lệch version React (30') ⭐

Bước quan trọng nhất. Làm tuần tự, **ghi lại log lỗi thật ở mỗi lần**.

### 4a. Phá bằng cách bỏ singleton

1. Ở `remote-user`, đổi `shared.react` thành `{ singleton: false }`.
2. Restart, vào `/user`.
3. Kỳ vọng: `Invalid hook call. Hooks can only be called inside the body of a
   function component` — vì có 2 React instance cùng lúc.
4. Ghi lại: message lỗi + stack trace.

### 4b. Phá bằng cách lệch version thật

1. Ở `remote-user`: `pnpm add react@18.3.1 react-dom@18.3.1` (host giữ React 19).
2. Sửa `bootstrap.tsx` của remote về API React 18 nếu cần build standalone.
3. Restart, quan sát:
   - Console warning: `Unsatisfied version 18.3.1 from remote_user of shared
     singleton module react (required ^19.0.0)`
   - Và/hoặc runtime crash khi hook chạy.
4. Thử biến warning thành error để thấy rõ:
   ```ts
   shared: {
     react: { singleton: true, requiredVersion: '^19.0.0', strictVersion: true },
   }
   ```
   → build/runtime fail thẳng thay vì âm thầm chạy sai.

### 4c. Sửa

1. Đưa `remote-user` về React 19 khớp host.
2. Bật lại `singleton: true` ở cả 3 app.
3. Xác nhận warning biến mất, hook chạy lại bình thường.
4. So sánh `shareStrategy`: `'version-first'` (mặc định) vs `'loaded-first'` —
   giải thích khác biệt bằng chính lỗi vừa gặp.

### 4d. Viết lại thành ghi chú

`NOTES.md` với: triệu chứng → nguyên nhân → cách phát hiện → cách sửa.
Đây là thứ mang đi kể được, không phải config file.

---

## Bước 5 — Nếu còn thời gian (25')

- [ ] Fallback khi remote down: tắt `:3002`, xem ErrorBoundary có bắt không.
- [ ] `pnpm build` cả 3 → xác nhận MF hoạt động ở production build, không chỉ dev.
- [ ] Xem network tab: `mf-manifest.json` → `remoteEntry.js` → chunk của component.
      Hiểu được thứ tự này là hiểu Module Federation.
- [ ] Thêm remote thứ 3 share một util lib để thấy chia sẻ dep không phải React.

## Những chỗ dễ vấp

| Vấn đề | Nguyên nhân |
|---|---|
| `Module not found: remote_cart/CartWidget` | Sai `name` trong config remote, hoặc remote chưa chạy |
| `Uncaught Error: Shared module is not available for eager consumption` | Thiếu lớp `bootstrap.tsx` — `index.tsx` phải `import('./bootstrap')` động |
| Remote name có dấu `-` | Là tên biến global, dùng snake_case |
| Sửa config nhưng không thấy đổi | MF cache manifest — restart dev server cả 2 phía |
| TS đỏ ở `import('remote_x/Y')` | Chưa khai báo module trong `env.d.ts` |
