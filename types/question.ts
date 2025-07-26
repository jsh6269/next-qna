export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
  tags: {
    name: string;
  }[];
  _count: {
    answers: number;
    likes: number;
  };
}
