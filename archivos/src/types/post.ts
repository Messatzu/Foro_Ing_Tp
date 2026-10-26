export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type DatosPost = Omit<Post, 'id'>;
