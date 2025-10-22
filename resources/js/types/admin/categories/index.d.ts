// resources/js/types/admin/categories/index.d.ts
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number | null;
    parent?: Category;
    children?: Category[];
    sort_order: number;       
    is_active: boolean;
    image?: string;
    meta_title?: string;
    meta_description?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface CategoryStats {
    total_categories: number;
    parent_categories: number;
    child_categories: number;
    active_categories: number;
}

export interface CategoriesIndexProps {
    categories: PaginatedResponse<Category>;
    parent_categories: Category[];
    stats: CategoryStats;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

export interface CategoriesCreateProps {
    parent_categories: Array<{ id: number; name: string }>;
}

export interface CategoriesEditProps {
    category: Category;
    parent_categories: Array<{ id: number; name: string }>;
}

interface CategoryFormData {
    name: string;
    description: string;
    parent_id: string;  
    sort_order: string; 
    is_active: boolean;
    image: File | null;
    meta_title: string;
    meta_description: string;
}