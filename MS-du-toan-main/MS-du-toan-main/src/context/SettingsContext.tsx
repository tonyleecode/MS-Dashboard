import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'vi' | 'en';

interface SettingsContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  vi: {
    'nav.estimation': 'Tính Dự Toán',
    'nav.history': 'Lịch Sử',
    'nav.management': 'Quản Lý Đơn Giá',
    'nav.pricing': 'Đơn Giá',
    'nav.projects': 'Dự Án',
    'nav.home': 'Về Trang Chủ',
    'nav.settings': 'Cài Đặt',
    'nav.support': 'Hỗ Trợ',
    'nav.activeEstimate': 'Bản nháp hiện tại',
    'app.status.new': 'Dự án mới',
    'app.status.draft': 'Đang tính toán (Nháp)',
    'app.status.saved': 'Đã lưu',
    'app.newEstimate': 'Dự Toán Mới',
    'settings.title': 'Cài đặt hệ thống',
    'settings.theme': 'Giao diện',
    'settings.theme.light': 'Sáng',
    'settings.theme.dark': 'Tối',
    'settings.language': 'Ngôn ngữ',
    'settings.language.vi': 'Tiếng Việt',
    'settings.language.en': 'English',
    'auth.title': 'Tài khoản',
    'auth.login': 'Đăng nhập với Google',
    'auth.logout': 'Đăng xuất',
    'auth.loginDesc': 'Đăng nhập để lưu và xem lại các bản dự toán của bạn.',
    'auth.requireAdmin': 'Bạn cần quyền Quản trị viên để truy cập trang này.',
    'support.title': 'Hỗ trợ & CSKH',
    'support.desc': 'Nếu bạn cần hỗ trợ, vui lòng sử dụng các nút liên hệ (Zalo, Messenger, Hotline) ở góc dưới bên phải màn hình.',
    'notifications.title': 'Thông báo',
    'notifications.empty': 'Chưa có thông báo nào.',
    'result.title': 'Kết quả Dự toán',
    'result.id': 'Mã dự toán',
    'result.date': 'Ngày tạo',
    'result.exportPDF': 'Xuất file PDF',
    'result.saveFile': 'Lưu dự toán',
    'result.totalEquivArea': 'TỔNG DIỆN TÍCH QUY ĐỔI',
    'result.unitPrice': 'ĐƠN GIÁ ÁP DỤNG',
    'result.totalCost': 'TỔNG CHI PHÍ DỰ KIẾN',
    'result.table.title': 'Bảng chi tiết hạng mục',
    'result.table.col1': 'Hạng mục',
    'result.table.col2': 'Diện tích (m2)',
    'result.table.col3': 'Hệ số (%)',
    'result.table.col4': 'Quy đổi (m2)',
    'result.table.total': 'Tổng cộng',
    'result.chart.title': 'Phân bổ chi phí',
    'result.chart.foundation': 'Móng',
    'result.chart.body': 'Thân nhà',
    'result.chart.roof': 'Mái & Khác',
    'result.chart.est': 'Dự toán',
    'result.disclaimer.title': 'Lưu ý quan trọng:',
    'result.disclaimer.desc': ' Đơn giá tham khảo có giá trị tại thời điểm hiện tại và áp dụng cho điều kiện thi công tiêu chuẩn. Báo giá chính xác sẽ có sau khi MIND & SOLID khảo sát thực tế và chốt bản vẽ phối cảnh 3D/mặt bằng công năng, từ đó lên bản vẽ kỹ thuật cấu trúc vật tư chi tiết.',
    // Tool translations
    'tool.title': 'Nhập dữ liệu dự toán',
    'tool.desc': 'Nhập các thông số kỹ thuật bên dưới để hệ thống tính toán chi phí xây dựng chính xác nhất theo thị trường hiện tại.',
    'tool.upload': 'Tải file bản vẽ',
    'tool.basicDim': 'Kích thước cơ bản',
    'tool.projectType': 'LOẠI CÔNG TRÌNH',
    'tool.projectType.nhaCap4': 'Nhà cấp 4 (Mái Thái, Mái Nhật)',
    'tool.projectType.nha2Tang': 'Nhà 2 tầng (1 trệt 1 lầu)',
    'tool.projectType.nha3Tang': 'Nhà 3 tầng (1 trệt 2 lầu)',
    'tool.projectType.nha4Tang': 'Nhà 4 tầng (1 trệt 3 lầu)',
    'tool.projectType.bietThu': 'Biệt thự',
    'tool.projectType.caiTao': 'Cải tạo / Sửa chữa',
    'tool.width': 'CHIỀU NGANG (M)',
    'tool.length': 'CHIỀU DÀI (M)',
    'tool.floors': 'SỐ TẦNG LẦU',
    'tool.floors.unit': 'tầng',
    'tool.tip.title': 'Mẹo nhỏ',
    'tool.tip.desc': 'Sử dụng số tầng thực tế không bao gồm tầng hầm và tum để có diện tích sàn chính xác nhất.',
    'tool.techSpecs': 'Cấu trúc & Kỹ thuật',
    'tool.foundation': 'LOẠI MÓNG',
    'tool.foundation.don': 'Móng đơn',
    'tool.foundation.coc': 'Móng cọc',
    'tool.foundation.bang': 'Móng băng',
    'tool.foundation.be': 'Móng bè',
    'tool.basement': 'TẦNG HẦM',
    'tool.basement.none': 'Không có tầng hầm',
    'tool.basement.shallow': 'Sâu < 1.3m',
    'tool.basement.medium': 'Sâu 1.3m - 1.7m',
    'tool.basement.deep': 'Sâu 1.7m - 2.0m',
    'tool.basement.very_deep': '> 2.0m',
    'tool.roof': 'LOẠI MÁI',
    'tool.roof.ton': 'Mái tôn',
    'tool.roof.bang': 'Mái bằng',
    'tool.roof.ngoikeosat': 'Mái ngói kèo sắt',
    'tool.roof.ngoiduc': 'Mái ngói đúc',
    'tool.packageType': 'HÌNH THỨC THI CÔNG',
    'tool.packageType.tho': 'Xây thô',
    'tool.packageType.tho.desc': 'Bao gồm vật tư thô và nhân công hoàn thiện',
    'tool.packageType.trongoi': 'Trọn gói',
    'tool.packageType.trongoi.desc': 'Khuyên dùng',
    'tool.packageLevel.tieuchuan': 'Gói Tiêu chuẩn',
    'tool.packageLevel.kha': 'Gói Khá',
    'tool.packageLevel.caocap': 'Gói Cao cấp',
    'tool.packageLevel.goodMaterial': 'Vật liệu hoàn thiện loại tốt',
    'tool.disclaimer.title': 'Lưu ý quan trọng:',
    'tool.disclaimer.desc': ' Đơn giá tham khảo có giá trị tại thời điểm hiện tại và áp dụng cho điều kiện thi công tiêu chuẩn. Báo giá chính xác sẽ có sau khi MIND & SOLID khảo sát thực tế và chốt bản vẽ phối cảnh 3D/mặt bằng công năng (nhà sử dụng thiết kế, vật tư), từ đó lên bản vẽ kỹ thuật cấu trúc xây dựng chi tiết để bóc tách khối lượng vật tư chính xác nhất.',
    'tool.ready.title': 'Sẵn sàng tính toán',
    'tool.ready.desc': 'Dữ liệu được cập nhật theo đơn giá 2026',
    'tool.calculateBtn': 'Tính toán dự toán',
    // History translations
    'history.title': 'Lịch sử dự toán',
    'history.empty': 'Bạn chưa có bản dự toán nào được lưu.',
    'history.col.name': 'Tên dự án',
    'history.col.date': 'Ngày lưu',
    'history.col.area': 'Diện tích',
    'history.col.cost': 'Tổng chi phí',
    'history.action.delete': 'Xóa',
    // Pricing translations
    'pricing.title': 'Đơn giá & Hệ số',
    'pricing.adminTitle': 'Quản lý Đơn giá & Hệ số',
    'pricing.subtitle': 'Đơn giá & Hệ số',
    'pricing.tab.price': 'Đơn giá thi công',
    'pricing.tab.coeff': 'Hệ số diện tích',
    'pricing.upload': 'Sử dụng Đơn giá hoặc Hệ số từ file Excel',
    'pricing.upload.success': 'Nhập file Excel thành công!',
    'pricing.upload.error': 'File Excel không hợp lệ hoặc không đúng định dạng mẫu.',
    'pricing.unitPrice.title': 'Đơn giá thi công',
    'pricing.coeff.title': 'Hệ số xây dựng & quy đổi',
    'pricing.save': 'Lưu thay đổi',
    'pricing.table.code': 'Mã Gói',
    'pricing.table.name': 'Tên Gói Dịch Vụ',
    'pricing.table.unit': 'Đơn vị',
    'pricing.table.price': 'Đơn giá (VNĐ)',
    'pricing.coeff.type': 'Hạng mục',
    'pricing.coeff.value': 'Hệ số (%)',
    'pricing.notice.title': 'Lưu ý:',
    'pricing.notice.desc': ' Đơn giá tham khảo có giá trị tại thời điểm hiện tại và áp dụng cho điều kiện thi công tiêu chuẩn. Báo giá chính xác sẽ có sau khi khảo sát thực tế chuyên sâu (hoặc cung cấp bản vẽ thiết kế, hồ sơ kỹ thuật đầy đủ).',
    'pricing.adminReq': 'Bạn cần đăng nhập với quyền Quản trị viên để chỉnh sửa',
    'pricing.updated': 'CẬP NHẬT:',
    'pricing.market.title': 'Gợi ý thị trường',
    'pricing.market.desc': 'Giá vật tư xây dựng quý hiện tại dự kiến tăng 5-8% do biến động giá thép.',
    'pricing.market.btn': 'Xem báo cáo chi tiết',
    'pricing.history.title': 'LỊCH SỬ THAY ĐỔI',
    'pricing.history.item1.title': 'Cập nhật đơn giá Gói Thô',
    'pricing.history.item1.desc': 'Bởi Admin -',
    'pricing.history.item2.title': 'Chỉnh sửa hệ số Mái',
    'pricing.history.item2.desc': 'Bởi Quản lý -',
    'tool.roof.terrace': 'Sân thượng',
  },
  en: {
    'nav.estimation': 'Estimation Tool',
    'nav.history': 'History',
    'nav.management': 'Price Management',
    'nav.pricing': 'Pricing',
    'nav.projects': 'Projects',
    'nav.home': 'Back to Home',
    'nav.settings': 'Settings',
    'nav.support': 'Support',
    'nav.activeEstimate': 'Active Estimate',
    'app.status.new': 'New Project',
    'app.status.draft': 'Calculating (Draft)',
    'app.status.saved': 'Saved',
    'app.newEstimate': 'New Estimate',
    'settings.title': 'System Settings',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.language': 'Language',
    'settings.language.vi': 'Tiếng Việt',
    'settings.language.en': 'English',
    'auth.title': 'Account',
    'auth.login': 'Login with Google',
    'auth.logout': 'Logout',
    'auth.loginDesc': 'Login to save and review your estimation data.',
    'auth.requireAdmin': 'You need Administrator privileges to access this page.',
    'support.title': 'Support & Customer Service',
    'support.desc': 'If you need support, please use the contact buttons (Zalo, Messenger, Hotline) in the bottom right corner of the screen.',
    'notifications.title': 'Notifications',
    'notifications.empty': 'No notifications yet.',
    'result.title': 'Estimation Result',
    'result.id': 'Estimate ID',
    'result.date': 'Created date',
    'result.exportPDF': 'Export PDF',
    'result.saveFile': 'Save Estimate',
    'result.totalEquivArea': 'TOTAL EQUIVALENT AREA',
    'result.unitPrice': 'APPLIED UNIT PRICE',
    'result.totalCost': 'ESTIMATED TOTAL COST',
    'result.table.title': 'Detailed Itemized Table',
    'result.table.col1': 'Item',
    'result.table.col2': 'Area (m2)',
    'result.table.col3': 'Coeff (%)',
    'result.table.col4': 'Equivalent (m2)',
    'result.table.total': 'Total',
    'result.chart.title': 'Cost Allocation',
    'result.chart.foundation': 'Foundation',
    'result.chart.body': 'Building Body',
    'result.chart.roof': 'Roof & Others',
    'result.chart.est': 'Estimate',
    'result.disclaimer.title': 'Important Note:',
    'result.disclaimer.desc': ' The reference unit price is valid at the current time and applies to standard construction conditions. An accurate quotation will be available after MIND & SOLID conducts an actual survey and finalizes the 3D perspective/functional floor plan, thereby generating detailed structural technical drawings.',
    // Tool translations
    'tool.title': 'Input Estimation Data',
    'tool.desc': 'Enter the technical parameters below for the system to accurately calculate construction costs based on current market rates.',
    'tool.upload': 'Upload Drawing File',
    'tool.basicDim': 'Basic Dimensions',
    'tool.projectType': 'PROJECT TYPE',
    'tool.projectType.nhaCap4': 'Level 4 House (Thai, Nhat Roof)',
    'tool.projectType.nha2Tang': '2-Story House',
    'tool.projectType.nha3Tang': '3-Story House',
    'tool.projectType.nha4Tang': '4-Story House',
    'tool.projectType.bietThu': 'Villa',
    'tool.projectType.caiTao': 'Renovation / Repair',
    'tool.width': 'WIDTH (M)',
    'tool.length': 'LENGTH (M)',
    'tool.floors': 'NUMBER OF FLOORS',
    'tool.floors.unit': 'floors',
    'tool.tip.title': 'Pro Tip',
    'tool.tip.desc': 'Use the actual number of floors excluding basement and attic for the most accurate floor area.',
    'tool.techSpecs': 'Structure & Engineering',
    'tool.foundation': 'FOUNDATION TYPE',
    'tool.foundation.don': 'Single footing',
    'tool.foundation.coc': 'Pile foundation',
    'tool.foundation.bang': 'Strip foundation',
    'tool.foundation.be': 'Raft foundation',
    'tool.basement': 'BASEMENT',
    'tool.basement.none': 'No basement',
    'tool.basement.shallow': 'Depth < 1.3m',
    'tool.basement.medium': 'Depth 1.3m - 1.7m',
    'tool.basement.deep': 'Depth 1.7m - 2.0m',
    'tool.basement.very_deep': '> 2.0m',
    'tool.roof': 'ROOF TYPE',
    'tool.roof.ton': 'Corrugated iron',
    'tool.roof.bang': 'Flat roof',
    'tool.roof.ngoikeosat': 'Tile with iron trusses',
    'tool.roof.ngoiduc': 'Cast tile roof',
    'tool.packageType': 'CONSTRUCTION TYPE',
    'tool.packageType.tho': 'Rough Construction',
    'tool.packageType.tho.desc': 'Includes rough materials and finishing labor',
    'tool.packageType.trongoi': 'Turnkey',
    'tool.packageType.trongoi.desc': 'Recommended',
    'tool.packageLevel.tieuchuan': 'Standard Package',
    'tool.packageLevel.kha': 'Good Package',
    'tool.packageLevel.caocap': 'Premium Package',
    'tool.packageLevel.goodMaterial': 'Good quality finishing materials',
    'tool.disclaimer.title': 'Important Note:',
    'tool.disclaimer.desc': ' The reference unit price is valid at the current time and applies to standard construction conditions. An accurate quotation will be available after MIND & SOLID conducts an actual survey and finalizes the 3D perspective/functional floor plan, thereby generating detailed structural technical drawings for the most accurate material volume extraction.',
    'tool.ready.title': 'Ready to calculate',
    'tool.ready.desc': 'Data updated according to 2026 unit prices',
    'tool.calculateBtn': 'Calculate Estimate',
    // History translations
    'history.title': 'Estimation History',
    'history.empty': 'You have no saved estimations yet.',
    'history.col.name': 'Project Name',
    'history.col.date': 'Date Saved',
    'history.col.area': 'Area',
    'history.col.cost': 'Total Cost',
    'history.action.delete': 'Delete',
    // Pricing translations
    'pricing.title': 'Prices & Coefficients',
    'pricing.adminTitle': 'Manage Prices & Coefficients',
    'pricing.subtitle': 'Prices & Coefficients',
    'pricing.tab.price': 'Construction Prices',
    'pricing.tab.coeff': 'Area Coefficients',
    'pricing.upload': 'Use Prices or Coefficients from Excel file',
    'pricing.upload.success': 'Imported Excel file successfully!',
    'pricing.upload.error': 'Invalid Excel file or incorrect format.',
    'pricing.unitPrice.title': 'Construction Prices',
    'pricing.coeff.title': 'Construction & Conversion Coefficients',
    'pricing.save': 'Save Changes',
    'pricing.table.code': 'Package Code',
    'pricing.table.name': 'Service Package Name',
    'pricing.table.unit': 'Unit',
    'pricing.table.price': 'Unit Price (VND)',
    'pricing.coeff.type': 'Category',
    'pricing.coeff.value': 'Coefficient (%)',
    'pricing.notice.title': 'Note:',
    'pricing.notice.desc': ' The reference unit price is valid at the current time and applies to standard construction conditions. An accurate quotation will be available after an in-depth actual survey (or providing full design drawings, technical dossiers).',
    'pricing.adminReq': 'You need to login with Administrator privileges to edit',
    'pricing.updated': 'UPDATED:',
    'pricing.market.title': 'Market Suggestion',
    'pricing.market.desc': 'Current quarter construction material prices are expected to increase by 5-8% due to fluctuations in steel prices.',
    'pricing.market.btn': 'View Detailed Report',
    'pricing.history.title': 'CHANGE HISTORY',
    'pricing.history.item1.title': 'Update Rough Construction price',
    'pricing.history.item1.desc': 'By Admin -',
    'pricing.history.item2.title': 'Edit Roof coefficient',
    'pricing.history.item2.desc': 'By Manager -',
    'tool.roof.terrace': 'Terrace',
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('ms_theme') as Theme) || 'light';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ms_lang') as Language) || 'vi';
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('ms_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem('ms_lang', l);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
