import { useState, useEffect } from "react";
import { CreatePost } from "./components/CreatePost";
import { PostList } from "./components/PostList";
import type { PostType, PostDetailsType } from "./types";
import { fetchPostDetails } from "./api";

// O array de posts iniciais continua o mesmo...
const initialPosts: PostType[] = [
  {
    id: 1,
    author: "Usuário 1",
    content:
      "Estou pensando em como essa Máquina Analítica poderia ser usada para compor músicas! 🎵",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutos atrás
  },
  {
    id: 2,
    author: "Usuário 2",
    content:
      "Acredito que em cerca de 50 anos, será possível programar computadores para que eles possam jogar xadrez muito bem.",
    timestamp: Date.now() - 1000 * 60 * 120, // 2 horas atrás
  },
];

function App() {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);

  // --- NOVOS ESTADOS ---
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postDetails, setPostDetails] = useState<PostDetailsType | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  // Efeito que busca os dados quando um post é selecionado
  useEffect(() => {
    if (selectedPostId === null) {
      setPostDetails(null);
      return;
    }

    const getDetails = async () => {
      setIsLoadingDetails(true);
      const details = await fetchPostDetails(selectedPostId);
      setPostDetails(details);
      setIsLoadingDetails(false);
    };

    getDetails();
  }, [selectedPostId]); // Roda sempre que `selectedPostId` mudar

  // Função para lidar com o clique em um post
  const handlePostSelect = (id: number) => {
    // Se o post clicado já está selecionado, deselecione-o. Senão, selecione-o.
    if (id === selectedPostId) {
      setSelectedPostId(null);
    } else {
      setSelectedPostId(id);
    }
  };

  // 👇 SUBSTITUA SUA FUNÇÃO POR ESTA VERSÃO ATUALIZADA
  const handleAddPost = (content: string) => {
    // --- 1. Montar o objeto para o "backend" ---
    const postParaBackend = {
      postId: Date.now(), // Usando timestamp como ID único para o protótipo
      text: content,
      createdAt: new Date().toISOString(), // Formato de data padrão ISO 8601
      authorId: 1, // Simulando um usuário logado com ID 1
    };

    // --- 2. Printar o objeto no terminal do navegador ---
    console.log("Enviando para o backend (simulação):", postParaBackend);

    // --- 3. Continuar atualizando a interface ---
    // Para não quebrar a UI, criamos um objeto no formato que os componentes esperam
    const novoPostParaUI: PostType = {
      id: postParaBackend.postId,
      author: `Usuário (ID: ${postParaBackend.authorId})`,
      content: postParaBackend.text,
      timestamp: Date.now(),
    };

    setPosts([novoPostParaUI, ...posts]);
  };

  return (
    <div className="bg-slate-100 w-[100vw] min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">
            Painel de controle da minha rede social
          </h1>
        </nav>
      </header>

      <main className="container mx-auto p-4 max-w-2xl">
        <h2 className="text-xl font-bold text-slate-700 mb-4">
          Simulação de Postagem em Rede Social
        </h2>
        <CreatePost onAddPost={handleAddPost} />
        <h2 className="text-xl font-bold text-slate-700 mt-8 mb-2">
          Mural de Posts
        </h2>
        <PostList
          posts={posts}
          selectedPostId={selectedPostId}
          postDetails={postDetails}
          isLoading={isLoadingDetails}
          onPostSelect={handlePostSelect}
        />{" "}
      </main>
    </div>
  );
}

export default App;
