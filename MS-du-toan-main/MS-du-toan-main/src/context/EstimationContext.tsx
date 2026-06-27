import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDocs, query, orderBy, where, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Prices {
  tho: number;
  tieuchuan: number;
  kha: number;
  caocap: number;
}

export interface Coefficients {
  basement: {
    none: number;
    shallow: number; // < 1.3m
    medium: number; // 1.3m - 1.7m
    deep: number; // 1.7m - 2.0m
    very_deep: number; // > 2.0m
  };
  foundation: {
    don: number;
    coc: number;
    bang: number;
    be: number;
  };
  roof: {
    ton: number;
    bang: number;
    ngoikeosat: number;
    ngoiduc: number;
  };
  roofTerrace: number;
  floor: number;
}

export interface EstimationData {
  width: number;
  length: number;
  floors: number; // Tầng lầu
  foundation: keyof Coefficients['foundation'];
  basement: keyof Coefficients['basement'];
  roof: keyof Coefficients['roof'];
  packageType: 'tho' | 'trongoi';
  packageLevel?: 'tieuchuan' | 'kha' | 'caocap';
  projectName?: string;
  projectType?: string;
}

export interface SavedEstimation {
  id: string;
  date: string;
  projectName: string;
  estimationData: EstimationData;
  totalArea: number;
  totalCost: number;
  userId: string;
  deleted?: boolean;
}

export type EstimationStatus = 'new' | 'draft' | 'saved';

interface EstimationContextType {
  prices: Prices;
  setPrices: (prices: Prices) => Promise<void>;
  coefficients: Coefficients;
  setCoefficients: (coefficients: Coefficients) => Promise<void>;
  saveSettings: () => Promise<void>;
  estimationData: EstimationData;
  setEstimationData: React.Dispatch<React.SetStateAction<EstimationData>>;
  savedEstimations: SavedEstimation[];
  saveEstimation: (totalArea: number, totalCost: number) => Promise<void>;
  deleteEstimation: (id: string) => Promise<void>;
  loadEstimation: (id: string) => void;
  resetEstimation: () => void;
  isLoading: boolean;
  activeEstimationId: string | null;
  estimationStatus: EstimationStatus;
}

const defaultPrices: Prices = {
  tho: 3650000,
  tieuchuan: 2400000,
  kha: 3150000,
  caocap: 4850000,
};

const defaultCoefficients: Coefficients = {
  basement: {
    none: 0,
    shallow: 150,
    medium: 170,
    deep: 200,
    very_deep: 250,
  },
  foundation: {
    don: 30,
    coc: 40,
    bang: 50,
    be: 50,
  },
  roof: {
    ton: 30,
    bang: 50,
    ngoikeosat: 70,
    ngoiduc: 100,
  },
  roofTerrace: 50,
  floor: 100,
};

const defaultEstimationData: EstimationData = {
  width: 5,
  length: 20,
  floors: 1,
  projectType: 'nha-cap-4',
  foundation: 'coc',
  basement: 'none',
  roof: 'ton',
  packageType: 'trongoi',
  packageLevel: 'kha',
};

const EstimationContext = createContext<EstimationContextType | undefined>(undefined);

export const EstimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [prices, setPricesState] = useState<Prices>(defaultPrices);
  const [coefficients, setCoefficientsState] = useState<Coefficients>(defaultCoefficients);
  const [estimationData, setEstimationData] = useState<EstimationData>(defaultEstimationData);
  const [savedEstimations, setSavedEstimations] = useState<SavedEstimation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEstimationId, setActiveEstimationId] = useState<string | null>(null);

  // Tính toán trạng thái dự toán (estimationStatus)
  let estimationStatus: EstimationStatus = 'draft';
  const isDefault = JSON.stringify(estimationData) === JSON.stringify(defaultEstimationData);

  if (activeEstimationId) {
    const activeEst = savedEstimations.find(e => e.id === activeEstimationId);
    if (activeEst && JSON.stringify(activeEst.estimationData) === JSON.stringify(estimationData)) {
      estimationStatus = 'saved';
    } else {
      estimationStatus = 'draft'; 
    }
  } else {
    if (isDefault) {
      estimationStatus = 'new';
    } else {
      estimationStatus = 'draft';
    }
  }

  const resetEstimation = () => {
    setEstimationData(defaultEstimationData);
    setActiveEstimationId(null);
  };


  useEffect(() => {
    // Lắng nghe dữ liệu cấu hình Đơn giá & Hệ số từ Firestore
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'estimation'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.prices) setPricesState(data.prices as Prices);
        if (data.coefficients) setCoefficientsState(data.coefficients as Coefficients);
      } else {
        // Nếu chưa có dữ liệu trên Firestore, nạp sẵn dữ liệu mặc định vào để mồi (chỉ dành cho user đầu tiên hoặc quá trình thiết lập)
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Lỗi khi load settings Firestore (Bạn nhớ mở Rules nhé!): ", error);
      setIsLoading(false);
    });

    // Lắng nghe lịch sử tính toán
    let unsubscribeEstimations = () => {};
    
    if (user) {
      const q = query(
        collection(db, 'estimations'), 
        where('userId', '==', user.uid)
      );
      
      unsubscribeEstimations = onSnapshot(q, (querySnapshot) => {
        const exts: SavedEstimation[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.deleted !== true) {
            exts.push({ id: docSnap.id, ...data } as SavedEstimation);
          }
        });
        // Sắp xếp giảm dần theo ngày
        exts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSavedEstimations(exts);
      }, (error) => {
        console.error("Lỗi khi load estimations từ Firestore: ", error);
        alert("Lỗi khi load lịch sử từ Firestore. Kiểm tra console.");
      });
    } else {
      setSavedEstimations([]);
    }

    return () => {
      unsubscribeSettings();
      unsubscribeEstimations();
    };
  }, [user]);

  const setPrices = async (newPrices: Prices) => {
    setPricesState(newPrices);
  };

  const setCoefficients = async (newCoefficients: Coefficients) => {
    setCoefficientsState(newCoefficients);
  };

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'estimation'), {
        prices,
        coefficients
      });
      alert('Các thay đổi đã được lưu thành công trên hệ thống.');
    } catch (e) {
      console.error("Lỗi khi lưu thiết lập: ", e);
      alert('Lỗi khi lưu lên Firebase. Bạn kiểm tra lại Rules trong Firebase Console.');
    }
  };

  const saveEstimation = async (totalArea: number, totalCost: number) => {
    if (!user) {
      alert('Bạn cần đăng nhập để lưu kết quả dự toán.');
      return;
    }

    const id = `MS-${Date.now()}`;
    const getProjectTypeName = (type: string | undefined, floors: number) => {
      switch (type) {
        case 'nha-cap-4': return 'Nhà cấp 4';
        case 'nha-2-tang': return 'Nhà phố 2 tầng';
        case 'nha-3-tang': return 'Nhà phố 3 tầng';
        case 'nha-4-tang': return 'Nhà phố 4 tầng';
        case 'biet-thu': return `Biệt thự ${floors} tầng`;
        case 'cai-tao': return 'Cải tạo / Sửa chữa';
        default: return `Nhà phố ${floors} tầng`;
      }
    };
    
    const generatedName = (estimationData.width && estimationData.floors) 
      ? `${getProjectTypeName(estimationData.projectType, estimationData.floors)} mặt tiền ${estimationData.width}m`
      : 'Chưa đặt tên';

    const newEstimation: SavedEstimation = {
      id,
      date: new Date().toISOString(),
      projectName: estimationData.projectName || generatedName,
      estimationData: { ...estimationData },
      totalArea,
      totalCost,
      userId: user.uid,
      deleted: false
    };
    
    // Tạm cập nhật UI ngay lập tức
    setSavedEstimations([newEstimation, ...savedEstimations]);
    
    try {
      await setDoc(doc(db, 'estimations', id), newEstimation);
      setActiveEstimationId(id);
      alert('Đã lưu dự toán thành công!');
    } catch (e: any) {
      console.error("Lỗi lưu dự toán:", e);
      alert(`Lỗi khi lưu dự toán: ${e?.message || e}. (Gợi ý: Kiểm tra lại quyền Firestore trong Firebase Console)`);
    }
  };

  const deleteEstimation = async (id: string) => {
    if (!user) return;
    setSavedEstimations(savedEstimations.filter(est => est.id !== id));
    try {
      await updateDoc(doc(db, 'estimations', id), { deleted: true });
    } catch (e) {
      console.error("Lỗi xóa dự toán:", e);
    }
  };

  const loadEstimation = (id: string) => {
    const est = savedEstimations.find(e => e.id === id);
    if (est) {
      setEstimationData(est.estimationData);
      setActiveEstimationId(id);
    }
  };

  return (
    <EstimationContext.Provider
      value={{
        prices,
        setPrices,
        coefficients,
        setCoefficients,
        saveSettings,
        estimationData,
        setEstimationData,
        savedEstimations,
        saveEstimation,
        deleteEstimation,
        loadEstimation,
        resetEstimation,
        isLoading,
        activeEstimationId,
        estimationStatus
      }}
    >
      {children}
    </EstimationContext.Provider>
  );
};

export const useEstimation = () => {
  const context = useContext(EstimationContext);
  if (context === undefined) {
    throw new Error('useEstimation must be used within an EstimationProvider');
  }
  return context;
};

