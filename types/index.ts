export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  tags: Tag[];
  _count: {
    answers: number;
    likes: number;
  };
}

export interface Answer {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  _count: {
    likes: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  _count?: {
    questions: number;
  };
}

export interface Like {
  id: string;
  userId: string;
  questionId?: string;
  answerId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
