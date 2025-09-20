// src/components/Post.tsx
import type { PostType } from "../types";

type PostProps = {
  post: PostType;
  // Nova propriedade para lidar com o clique
  onPostSelect: (id: number) => void;
  isSelected: boolean;
};

// formata a data para uma leitura mais amigável
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function Post({ post, onPostSelect, isSelected }: PostProps) {
  // Adicionamos classes para o estado selecionado
  const selectedClasses = isSelected
    ? "ring-2 ring-blue-500"
    : "border-gray-200";

  return (
    // Transformamos o div principal em um botão clicável
    <div
      onClick={() => onPostSelect(post.id)}
      className={`w-full text-left bg-slate-100 p-5 rounded-lg shadow-md mb-4 border transition-all duration-200 hover:bg-slate-200 ${selectedClasses}`}>
      <div className="flex items-center mb-3 ">
        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white mr-3">
          {/* Pega a primeira letra do autor para o avatar */}
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-slate-800">{post.author}</p>
          <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
        </div>
      </div>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}
