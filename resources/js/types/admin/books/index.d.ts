// resources/js/types/admin/books.ts
export interface Book {
    id: number;
    title: string;
    isbn: string;
    publication_year?: number;
    pages: number;
    cover_image?: string;
    pdf_file?: string;
    is_active: boolean;
    featured: boolean;
    book_type: string;
    access_level: string;
    copyright_status: string;
    total_views: number;
    total_downloads: number;
    total_loans?: number;
    available_physical_copies?: number;
    downloadable?: boolean;
    license_type?: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
    publisher?: Publisher;
    language?: Language;
    categories?: Category[];
    contributors?: Contributor[];
}

export interface Publisher {
    id: number;
    name: string;
    country?: string;
    city?: string;
    website?: string;
}

export interface Language {
    code: string;
    name: string;
    native_name?: string;
}


export interface Contributor {
    id: number;
    full_name: string;
    contributor_type: string;
    email?: string;
    sequence_number?: number;
    biographical_note?: string;
}

// Interfaces para props de componentes admin
export interface BookDetailsModalProps {
    book: Book;
}

export interface BookTableProps {
    books: Book[];
    onEdit?: (book: Book) => void;
    onDelete?: (book: Book) => void;
    onToggleStatus?: (book: Book) => void;
    onToggleFeatured?: (book: Book) => void;
}

export interface BookFilters {
    search?: string;
    category?: string;
    status?: string;
    book_type?: string;
    access_level?: string;
}

export interface BookStats {
    total_books: number;
    active_books: number;
    featured_books: number;
    digital_books?: number;
    physical_books?: number;
}

// Tipos para paginación
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedBooks {
    data: Book[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}