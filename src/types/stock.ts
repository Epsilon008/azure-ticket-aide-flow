
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  department?: string;
}

export interface Employee {
  _id: string;
  name: string;
  department: string;
  assignedItems: AssignedItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignedItem {
  equipment: Equipment;
  quantity: number;
  assignedDate: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  _id: string;
  name: string;
  category: Category;
  currentStock: number;
  criticalLevel: number;
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  employee: {
    _id: string;
    name: string;
    department: string;
  };
  equipment: {
    _id: string;
    name: string;
  };
  quantity: number;
  type: 'assignment' | 'deassignment';
  date: string;
  notes?: string;
  assignedBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  totalEquipment: number;
  criticalStock: number;
  totalEmployees: number;
  totalStockValue: number;
  categoryStats: CategoryStat[];
}

export interface CategoryStat {
  _id: string;
  totalStock: number;
  criticalItems: number;
}

export interface PurchaseOrder {
  _id: string;
  orderNumber: string;
  items: PurchaseOrderItem[];
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  totalAmount?: number;
  supplier?: string;
  createdBy: User;
  orderDate: string;
  expectedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  equipment: Equipment;
  quantity: number;
  unitPrice?: number;
}

export type EmployeeFormData = Omit<Employee, '_id' | 'createdAt' | 'updatedAt' | 'assignedItems'>;
export type EquipmentFormData = Omit<Equipment, '_id' | 'createdAt' | 'updatedAt' | 'category'> & {
  category: string;
};
export type CategoryFormData = Omit<Category, '_id' | 'createdAt' | 'updatedAt'>;
