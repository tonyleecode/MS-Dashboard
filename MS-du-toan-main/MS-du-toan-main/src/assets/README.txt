Thư mục này dành riêng cho các tài sản NỘI BỘ của mã nguồn (Internal Assets).

Các file ở đây (logo SVG, hình ảnh, icon) khi code đều dùng cấu trúc `import` trong file .tsx. Vite sẽ tự động gom (bundle) và tối ưu hóa chúng.

Cấu trúc:
- /images: Hình ảnh giao diện cố định (logo, hình banner UI).
- /icons: Các icon SVG mà bạn muốn import như component.

Ví dụ:
import logoMS from '../assets/images/logo-ms.png';
<img src={logoMS} alt="Logo" />
